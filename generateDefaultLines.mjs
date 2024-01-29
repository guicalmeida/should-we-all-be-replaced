import { fetchAIVoiceData } from "./utils.mjs";
import { poemArray } from "./values.mjs";

export default async function generateDefaultLines() {
  try {
    poemArray.forEach(async (line, i) => {
      await fetchAIVoiceData(line, i, "defaultLines");
    });
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
}
