import rssJson  from "rss-to-json";
import { fetchAIVoiceData } from "./voiceHelper.mjs";

(async () => {
  try {
    const rss = await rssJson.parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );

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

    const poeticTrends = rss?.items?.map((item) => {
      return `É preciso ${
        prefixes[Math.floor(Math.random() * prefixes.length)]
      } ${item?.title}`;
    });

    for (let i = 0; i < poeticTrends.length; i++) {
      fetchAIVoiceData(poeticTrends[i], i, "googleLines");
    }

    // generate each line
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
