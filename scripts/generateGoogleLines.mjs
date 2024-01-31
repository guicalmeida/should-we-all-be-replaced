import rssJson from "rss-to-json";
import { fetchAIVoiceData } from "../helpers/utils.mjs";
import chalk from "chalk";
import { prefixes } from "../helpers/values.mjs";

export default async function generateGoogleLines() {
  try {
    const agaGreen = chalk.hex("#00E600").bold;

    console.log(agaGreen("\n\nINITIALIZING GOOGLE POEM GENERATION...\n\n"));

    const rss = await rssJson.parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );

    const titles = await rss?.items?.map((item) => item?.title);

    const poeticTrends = titles?.map((title) => {
      return `É preciso ${
        prefixes[Math.floor(Math.random() * prefixes.length)]
      } ${title}`;
    });

    for (let i = 0; i < poeticTrends.length; i++) {
      await fetchAIVoiceData(poeticTrends[i], i, "googleLines", titles[i]);
    }

    console.log(agaGreen("\n\nGOOGLE POEM GENERATION ENDED SUCCESSFULLY\n\n"));

  } catch (error) {
    console.log(
      chalk.red.bold(
        "\n\nERROR GENERATING GOOGLE POEM. NO INTERNET CONNECTION?\n\n"
      )
    );
  }
}
