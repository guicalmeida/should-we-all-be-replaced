import rssJson from "rss-to-json";
import { fetchAIVoiceData } from "./utils.mjs";

(async () => {
  try {
    const rss = await rssJson.parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );

    const titles = await rss?.items?.map((item) => item?.title);

    const prefixes = [
      "pesquisar sobre",
      "entender melhor",
      "estudar",
      "acreditar em",
      "saber mais de",
      "chegar a",
      "saber tudo de",
      "contar com",
    ];

    const poeticTrends = titles?.map((title) => {
      return `É preciso ${
        prefixes[Math.floor(Math.random() * prefixes.length)]
      } ${title}`;
    });

    for (let i = 0; i < poeticTrends.length; i++) {
      fetchAIVoiceData(poeticTrends[i], i, "googleLines", titles[i]);
    }

    // generate each line
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
