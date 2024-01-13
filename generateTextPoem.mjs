import rssJson  from "rss-to-json";
import * as fs from 'fs'

(async () => {
  try {
    const rss = await rssJson.parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );

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

    const newPoem = [];

    poemArray.forEach((verse) => {
      newPoem.push(verse);
      if (Math.random() > 0.3) {
        const verseIndex = Math.floor(Math.random() * poeticTrends.length);
        newPoem.push(poeticTrends[verseIndex]);
        poeticTrends.splice(verseIndex, 1);
      }
    });

    const finalPoemText = (
      "       " +
      newPoem.join("       ") +
      "       " +
      lastStanza.replace(/\n/g, "       ")
    ).toUpperCase();

    fs.writeFileSync("poem.txt", finalPoemText);
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
