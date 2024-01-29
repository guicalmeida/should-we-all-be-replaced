import rssJson from "rss-to-json";
import * as fs from "fs";
import { combineVerses } from "./utils.mjs";
import { lastStanza, poemArray, prefixes } from "./values.mjs";
import dayjs from "dayjs";

export default async function generateTextPoem() {
  const metadataFilePath = "./textPoems/metadata.json";
  try {
    if (!fs.existsSync("./textPoems")) {
      fs.mkdirSync("./textPoems", { recursive: true });
    }
    if (!fs.existsSync(metadataFilePath)) {
      fs.writeFileSync(metadataFilePath, "[]", "utf8");
    }
    const data = fs.readFileSync(metadataFilePath, "utf8");
    const metadata = JSON.parse(data);

    const rss = await rssJson.parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );
    await rss?.items?.map((item) => {
      metadata.push({
        text: item?.title,
        creationDate: dayjs().format("YYYY-MM-DDTHH:mm"),
      });

      fs.writeFileSync(metadataFilePath, JSON.stringify(metadata));
    });

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
