import { fetchAIVoiceData } from "./voiceHelper.mjs";

(async () => {
  try {
    const poemArray = [
      "É preciso casar João,",
      "é preciso suportar Antônio,",
      "é preciso odiar Melquíades",
      "é preciso substituir nós todos.",
      "É preciso salvar o país,",
      "é preciso crer em Deus,",
      "é preciso pagar as dívidas,",
      "é preciso comprar um rádio,",
      "é preciso esquecer fulana.",
      "É preciso estudar volapuque,",
      "é preciso estar sempre bêbado,",
      "é preciso ler Baudelaire,",
      "é preciso colher as flores de que rezam velhos autores.",
    ];

    // generate each line
    poemArray.forEach(async (line, i) => {
      await fetchAIVoiceData(line, i, "defaultLines");
    });
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
