import { fetchAIVoiceData } from "../helpers/utils.mjs";
import { poemArray } from "../helpers/values.mjs";

export default async function generateDefaultLines() {
  try {
    poemArray.forEach(async (line, i) => {
      await fetchAIVoiceData(line, i, "defaultLines");
    });
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
}
