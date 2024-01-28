import * as fs from "fs";
import { combineVerses, prefixes } from "./utils.mjs";
import metadata from "./googleLines/metadata.json" assert { type: "json" };

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

    const lastStanza = `É preciso viver com os homens\né preciso não assassiná-los,\né preciso ter mãos pálidas\ne anunciar O FIM DO MUNDO.`;

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

      fs.writeFileSync(`poem_${i}.txt`, finalPoemText);
    }
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
