import * as fs from "fs";
import dayjs from "dayjs";

export const possibleVoices = [
  "21m00Tcm4TlvDq8ikWAM",
  "29vD33N1CtxCmqQRPOHJ",
  "2EiwWnXFnvU5JabPnv8n",
  "5Q0t7uMcjvnagumLfvZi",
  "AZnzlk1XvdvUeBnXmlld",
  "CYw3kZ02Hs0563khs1Fj",
  "D38z5RcWu1voky8WS1ja",
  "EXAVITQu4vr4xnSDxMaL",
  "ErXwobaYiN019PkySvjV",
  "GBv7mTt0atIp3Br8iCZE",
  "IKne3meq5aSn9XLyUdCD",
  "JBFqnCBsd6RMkjVDRZzb",
  "LcfcDJNUP1GQjkzn1xUU",
  "MF3mGyEYCl7XYWbV9V6O",
  "N2lVS1w4EtoT3dr4eOWO",
  "ODq5zmih8GrVes37Dizd",
  "SOYHLrjzK2X1ezoPC6cr",
  "TX3LPaxmHKxFdv7VOQHJ",
  "ThT5KcBeYPX3keUQqHPh",
  "TxGEqnHWrfWFTfGW9XjX",
  "VR6AewLTigWG4xSOukaG",
  "XB0fDUnXU5powFXDhCwa",
  "XrExE9yKIg1WjnnlVkGX",
  "Yko7PKHZNXotIFUBG7I9",
  "ZQe5CZNOzWyzPSCn5a3c",
  "Zlb1dXrM653N07WRdFW3",
  "bVMeCyTHy58xNoL34h3p",
  "flq6f7yk4E4fJM5XTYuZ",
  "g5CIjZEefAph4nQFvHAz",
  "jBpfuIE2acCO8z3wKNLl",
  "jsCqWAovK2LkecY7zXl4",
  "knrPHWnBmmDHMoiMeP3l",
  "oWAxZDx7w5VEj9dCyTzz",
  "onwK4e9ZLuTAKqWW03F9",
  "pFZP5JQG7iQjIQuC4Bku",
  "pMsXgVXv3BLzUgSXRplE",
  "pNInz6obpgDQGcFmaJgB",
  "piTKgcLEGmPE4e6mEKli",
  "pqHfZKP75CvOlQylNhV4",
  "t0jbNlBVZ17f02VDIeMI",
  "yoZ06aMxZJJ28mfd3POQ",
  "z9fAnlkpzviPz146aGWa",
  "zcAOhNBS3c14rBihAFp1",
];

export function fetchAIVoiceData(line, i, dir) {
  setTimeout(() => {
    const indexStr = i <= 8 ? `0${i + 1}` : `${i + 1}`;
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
        fs.writeFileSync(
          `./${dir}/line_${indexStr}-${dayjs().format("DD-MM-YYYY")}.mp3`,
          buffer
        );
      })
      .then(() => {
        console.log(`line ${indexStr} successfully created`);
        fs.appendFileSync(
          `./${dir}/voicesUsed.txt`,
          `line ${indexStr} voice id: ${finalVoice}\n`
        );
      })
      .catch((err) => console.error(err));
  }, 2000 * i);
}

export function combineVerses(originalPoemArr, googlePoemArr) {
  const combinedArray = [];

  originalPoemArr.forEach((defaultLine, i) => {
    const addGoogleLine = () => {
      const thisLineIndex = Math.floor(Math.random() * googlePoemArr.length);
      combinedArray.push(googlePoemArr[thisLineIndex]);
      googlePoemArr.splice(thisLineIndex, 1);
    };

    combinedArray.push(defaultLine);
    addGoogleLine();
    const remaining = originalPoemArr.length - i;

    if (googlePoemArr.length >= remaining && Math.random() > 0.3) {
      addGoogleLine();
    } else if (i === originalPoemArr.length - 1) {
      while (googlePoemArr.length > 0) {
        addGoogleLine();
      }
    }
  });
  return combinedArray;
}
