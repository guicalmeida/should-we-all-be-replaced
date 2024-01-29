import * as fs from "fs";
import dayjs from "dayjs";
import chalk from "chalk";
import slugify from "slugify";
import { possibleVoices } from "./values.mjs";

export function fetchAIVoiceData(line, i, dir, title) {
  const dirPath = `./${dir}`;
  const filePath = `${dirPath}/metadata.json`;
  const indexStr = i <= 8 ? `0${i + 1}` : `${i + 1}`;
  const metadataText = title ? title : `line_${indexStr}`;

  let isRepeated = false;

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
    }
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);
    if (json.some((meta) => meta.text === metadataText)) {
      isRepeated = true;
    }
  } catch (err) {
    console.error(err);
  }

  if (isRepeated) {
    console.log(`text "${metadataText}" already generated`);
    return;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const finalVoice =
        possibleVoices[Math.floor(Math.random() * possibleVoices.length)];

      const url = `https://api.elevenlabs.io/v1/text-to-speech/${finalVoice}?output_format=mp3_22050_32`;

      const options = {
        method: "POST",
        headers: {
          "xi-api-key": "2c9254298dd9d9ad604ee47bc08e7a0b",
          "Content-Type": "application/json",
        },
        body: `{"model_id":"eleven_multilingual_v2","text": ${JSON.stringify(
          line
        )}, "voice_settings":{"similarity_boost":0.5,"stability":0.75,"style":0,"use_speaker_boost":true}}`,
      };

      fetch(url, options)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          const buffer = Buffer.from(arrayBuffer);
          const slug = slugify(title ?? line, {
            lower: true,
            remove: /[\\.,:/"()]/g,
            replacement: "_",
          });

          const fileName = `./${dir}/${slug}-${dayjs().format(
            "DD-MM-YYYY"
          )}.mp3`;

          fs.writeFileSync(fileName, buffer);
        })
        .then(() => {
          const agaGreen = chalk.hex("#00E600").bold;
          console.log(agaGreen(`text ${metadataText} successfully created`));
          try {
            const data = fs.readFileSync(filePath, "utf8");
            const json = JSON.parse(data);

            json.push({
              text: metadataText,
              voiceId: finalVoice,
              creationDate: dayjs().format("YYYY-MM-DDTHH:mm"),
            });

            fs.writeFileSync(filePath, JSON.stringify(json));
            resolve();
          } catch (err) {
            console.error(err);
            reject(err);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    }, 2000 * i);
  });
}

export function combineVerses(originalPoemArr, googlePoemArr) {
  const combinedArray = [];

  originalPoemArr.forEach((defaultLine, i) => {
    const addGoogleLine = () => {
      if (googlePoemArr.length > 0) {
        const thisLineIndex = Math.floor(Math.random() * googlePoemArr.length);
        combinedArray.push(googlePoemArr[thisLineIndex]);
        googlePoemArr.splice(thisLineIndex, 1);
      }
    };

    combinedArray.push(defaultLine);
    addGoogleLine();

    while (googlePoemArr.length > 0 && Math.random() > 0.4) {
      addGoogleLine();
    }
  });

  while (googlePoemArr.length > 0) {
    combinedArray.push(googlePoemArr.shift());
  }

  return combinedArray;
}
