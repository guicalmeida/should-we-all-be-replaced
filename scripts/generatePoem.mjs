import dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { combineVerses } from "../helpers/utils.mjs";
import generateGoogleLines from "./generateGoogleLines.mjs";
import chalk from "chalk";

export default async function generateAudioPoem() {
  function readMP3FilesFromDirectory(directory) {
    try {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      const files = fs.readdirSync(directory);
      const mp3Files = files.filter(
        (file) => path.extname(file).toLowerCase() === ".mp3"
      );
      return mp3Files.map((file) => path.join(directory, file));
    } catch {
      throw new Error(
        `failed to read dir: ${directory}. Was it generated already?`
      );
    }
  }

  function combineMP3Files(outputFile, inputFiles) {
    const fileList = inputFiles.map((file) => `-i "${file}"`).join(" ");
    if (!fs.existsSync("./output")) {
      fs.mkdirSync("./output", { recursive: true });
    }

    const command = `ffmpeg -y ${fileList} -filter_complex concat=n=${inputFiles.length}:v=0:a=1,compand,loudnorm -q:a 2 "${outputFile}"`;
    execSync(command, { stdio: "ignore" });

    execSync(
      'ffmpeg -y -i ./output/finalPoem.mp3 -i ./city_soundscape.mp3 -filter_complex "[0:a]volume=1.0[a];[1:a]volume=0.2[b];[a][b]amix=inputs=2:duration=first" ./output/poem_with_soundscape.mp3',
      { stdio: "ignore" }
    );
  }

  const googleLinesDirectory = "./googleLines";
  const defaultLinesDirectory = "./defaultLines";
  const finalStanzasDirectory = "./finalStanzas";

  const initialGoogleLinesArray =
    readMP3FilesFromDirectory(googleLinesDirectory);
  const defaultLinesArray = readMP3FilesFromDirectory(defaultLinesDirectory);
  const finalStanzasArray = readMP3FilesFromDirectory(finalStanzasDirectory);

  let fileStats = {};
  if (initialGoogleLinesArray.length > 0) {
    fileStats = fs.statSync(`./${initialGoogleLinesArray[0]}`);
  }

  const creationDate = fileStats?.birthtime
    ? dayjs(fileStats.birthtime)
    : dayjs("1970-12-30");

  if (
    initialGoogleLinesArray.length < 1 ||
    creationDate.format("DD/MM/YYYY HH:mm") !==
      dayjs().format("DD/MM/YYYY HH:mm")
  ) {
    await generateGoogleLines()
      .then(() => {
        const newGoogleLinesArray =
          readMP3FilesFromDirectory(googleLinesDirectory);
        if (newGoogleLinesArray.length > 0) {
          processFiles(newGoogleLinesArray);
        }
      })
      .catch(() => {
        processFiles(initialGoogleLinesArray);
      });
  } else {
    processFiles(initialGoogleLinesArray);
  }

  function processFiles(googleLinesArray) {
    const originalLinesLength = googleLinesArray.length;
    const combinedArray = combineVerses(defaultLinesArray, googleLinesArray);

    if (finalStanzasArray.length > 0) {
      const randomStanzaIndex = Math.floor(
        Math.random() * finalStanzasArray.length
      );
      combinedArray.push(finalStanzasArray[randomStanzaIndex]);
    }

    if (originalLinesLength != initialGoogleLinesArray.length) {
      const agaGreen = chalk.hex("#00E600").bold;
      console.log(agaGreen(`\n\nGENERATING NEW POEM...\n\n`));
      combineMP3Files("./output/finalPoem.mp3", combinedArray);
      console.log(agaGreen(`\n\nFINAL MP3 FILE GENERATED SUCCESSFULLY\n\n`));
    } else {
      const purple = chalk.hex("#CC99FF").bold;
      console.log(purple("\n\nUSING EXISTING POEM...\n\n"));
    }
  }
}
