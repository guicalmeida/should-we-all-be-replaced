import * as fs from "fs";
import { combineVerses } from "./utils.mjs";
import { lastStanza, poemArray, prefixes } from "./values.mjs";

export default function generateTextPoem() {
  const metadataFilePath = "./googleLines/metadata.json";
  try {
    if (!fs.existsSync("./textPoems")) {
      fs.mkdirSync("./textPoems", { recursive: true });
    }
    if (!fs.existsSync(metadataFilePath)) {
      throw new Error(
        'no google lines generated! Run the command "npm run generateGoogleLines" to create them.'
      );
    }
    const data = fs.readFileSync(metadataFilePath, "utf8");
    const metadata = JSON.parse(data);

    const poeticTrends = metadata?.map((item) => {
      return `É preciso ${
        prefixes[Math.floor(Math.random() * prefixes.length)]
      } ${item?.text}`;
    });

    function remove30percentItems(arr) {
      const arrCopy = [...arr];
      const newArr = [];
      const thirtyPctLess = Math.floor(arr.length * 0.7);
      do {
        const randomIndex = Math.floor(Math.random() * arrCopy.length);
        newArr.push(arrCopy[randomIndex]);
        arrCopy.splice(randomIndex, 1);
      } while (arrCopy.length > thirtyPctLess);
      return newArr;
    }

    for (let i = 0; i < 10; i++) {
      const newTrends = remove30percentItems(poeticTrends);
      const newPoem = combineVerses(poemArray, newTrends);

      const finalPoemText = (
        "       " +
        newPoem.join("       ") +
        "       " +
        lastStanza.replace(/\n/g, "       ")
      ).toUpperCase();

      fs.writeFileSync(`./textPoems/poem_${i}.txt`, finalPoemText);
    }
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
}
