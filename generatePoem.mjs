import dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { combineVerses } from "./utils.mjs";
import generateGoogleLines from "./generateGoogleLines.mjs";

// Function to read MP3 files from a directory and return an array
function readMP3FilesFromDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    const mp3Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".mp3"
    );
    return mp3Files.map((file) => path.join(directory, file));
  } catch {
    console.error("failed to read dir: ", directory);
  }
}

// Function to combine MP3 files using ffmpeg
function combineMP3Files(outputFile, inputFiles) {
  const fileList = inputFiles.map((file) => `-i "${file}"`).join(" ");
  const command = `ffmpeg -y ${fileList} -filter_complex concat=n=${inputFiles.length}:v=0:a=1,compand,loudnorm -q:a 2 "${outputFile}"`;
  execSync(command, { stdio: "inherit" });

  execSync(
    'ffmpeg -y -i ./output/finalPoem.mp3 -i ./city_soundscape.mp3 -filter_complex "[0:a]volume=1.0[a];[1:a]volume=0.2[b];[a][b]amix=inputs=2:duration=first" ./output/poem_with_soundscape.mp3',
    { stdio: "inherit" }
  );
}

// Specify your directory paths
const googleLinesDirectory = "./googleLines";
const defaultLinesDirectory = "./defaultLines";
const finalStanzasDirectory = "./finalStanzas";

// Read MP3 files from directories
const initialGoogleLinesArray = readMP3FilesFromDirectory(googleLinesDirectory);
const defaultLinesArray = readMP3FilesFromDirectory(defaultLinesDirectory);
const finalStanzasArray = readMP3FilesFromDirectory(finalStanzasDirectory);

const fileStats = fs.statSync(`./${initialGoogleLinesArray[0]}`);
const creationDate = dayjs(fileStats.birthtime);

if (
  initialGoogleLinesArray.length < 1 ||
  creationDate.format("DD/MM/YYYY HH:mm") !== dayjs().format("DD/MM/YYYY HH:mm")
) {
  await generateGoogleLines().then(() => {
    const newGoogleLinesArray = readMP3FilesFromDirectory(googleLinesDirectory);
    if (newGoogleLinesArray.length > 0) {
      processFiles(newGoogleLinesArray);
    }
  });
} else {
  processFiles(initialGoogleLinesArray);
}

function processFiles(googleLinesArray) {
  const originalLinesLength = googleLinesArray.length
  const combinedArray = combineVerses(defaultLinesArray, googleLinesArray);

  if (finalStanzasArray.length > 0) {
    const randomStanzaIndex = Math.floor(
      Math.random() * finalStanzasArray.length
    );
    combinedArray.push(finalStanzasArray[randomStanzaIndex]);
  }

  if (originalLinesLength == initialGoogleLinesArray.length) {
    combineMP3Files("./output/finalPoem.mp3", combinedArray);
    console.log(`\n\nFINAL MP3 FILE GENERATED SUCCESSFULLY\n\n`);
  } else {
    console.log("\n\nUSING EXISTING POEM...\n\n");
  }
}
