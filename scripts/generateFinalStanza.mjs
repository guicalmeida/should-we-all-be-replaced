import { fetchAIVoiceData } from "../helpers/utils.mjs";
import { lastStanza } from "../helpers/values.mjs";

export default async function generateFinalStanza(numOfVoices = 5) {
  try {
    for (let i = 0; i < numOfVoices; i++) {
      await fetchAIVoiceData(lastStanza, i, "finalStanzas", `finalStanza_${i}`);
    }
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
}
