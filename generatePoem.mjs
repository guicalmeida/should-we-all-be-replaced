import dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const files = fs.readdirSync('./googleLines');
const fileStats = fs.statSync(`./googleLines/${files[0]}`);
const creationDate = dayjs(fileStats.birthtime);

// Check if the file was not created today
if (creationDate.format("DD/MM/YYYY") !== dayjs().format("DD/MM/YYYY")) {
  execSync(
    "rm ./googleLines/* && touch ./googleLines/voicesUsed.txt &&  node ./generateGoogleLines.mjs"
  );
}

// Function to read MP3 files from a directory and return an array
function readMP3FilesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  const mp3Files = files.filter(
    (file) => path.extname(file).toLowerCase() === ".mp3"
  );
  return mp3Files.map((file) => path.join(directory, file));
}

// Function to combine MP3 files using ffmpeg
function combineMP3Files(outputFile, inputFiles) {
  const fileList = inputFiles.map((file) => `-i "${file}"`).join(" ");
  const command = `ffmpeg -y ${fileList} -filter_complex concat=n=${inputFiles.length}:v=0:a=1 -q:a 2 "${outputFile}"`;
  execSync(command);

  execSync(
    'ffmpeg -y -i ./output/finalPoem.mp3 -i ./city_soundscape.mp3 -filter_complex "[0:a]volume=1.0[a];[1:a]volume=0.3[b];[a][b]amix=inputs=2:duration=first" ./output/poem_with_soundscape.mp3'
  );
}

// Specify your directory paths
const googleLinesDirectory = "./googleLines";
const defaultLinesDirectory = "./defaultLines";
const finalStanzasDirectory = "./finalStanzas";

// Read MP3 files from directories
const googleLinesArray = readMP3FilesFromDirectory(googleLinesDirectory);
const defaultLinesArray = readMP3FilesFromDirectory(defaultLinesDirectory);
const finalStanzasArray = readMP3FilesFromDirectory(finalStanzasDirectory);

// Combine MP3 files
const combinedArray = [];

defaultLinesArray.map((defaultLine) => {
  combinedArray.push(defaultLine);
  if (Math.random() > 0.3) {
    const thisLineIndex = Math.floor(Math.random() * googleLinesArray.length);
    combinedArray.push(googleLinesArray[thisLineIndex]);
    googleLinesArray.splice(thisLineIndex, 1);
  }
});

// Add a random final stanza
if (finalStanzasArray.length > 0) {
  const randomStanzaIndex = Math.floor(
    Math.random() * finalStanzasArray.length
  );
  combinedArray.push(finalStanzasArray[randomStanzaIndex]);
}

// Combine the arrays into a final MP3 file
combineMP3Files('./output/finalPoem.mp3', combinedArray);

console.log(`Final MP3 file generated`);
