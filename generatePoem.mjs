import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

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
  const command = `ffmpeg ${fileList} -filter_complex concat=n=${inputFiles.length}:v=0:a=1 -q:a 2 "${outputFile}"`;
  execSync(command);

  execSync(
    'ffmpeg -i ./output/finalPoem.mp3 -i ./city_soundscape.mp3 -filter_complex "[0:a]volume=1.0[a];[1:a]volume=0.5[b];[a][b]amix=inputs=2:duration=first" finalFile.mp3'
  );
}

// Specify your directory paths
const googleLinesDirectory = "./googleLines";
const defaultLinesDirectory = "./defaultLines";
const finalStanzasDirectory = "./finalStanzas";
const outputDirectory = "./output";

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

// Specify the output file
const outputFile = path.join(outputDirectory, "finalPoem.mp3");

// Combine the arrays into a final MP3 file
combineMP3Files(outputFile, combinedArray);

console.log(`Final MP3 file generated at: ${outputFile}`);
