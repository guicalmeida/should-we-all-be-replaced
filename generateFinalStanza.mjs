import { fetchAIVoiceData } from "./voiceHelper.mjs";

(async () => {
  try {
    const lastStanza = `É preciso viver com os homens\né preciso não assassiná-los,\né preciso ter mãos pálidas\ne anunciar O FIM DO MUNDO.`;

    // generate last stanza in multiple voices
    for (let i = 4; i < 10; i++) {
      fetchAIVoiceData(lastStanza, i, "finalStanzas");
    }
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
