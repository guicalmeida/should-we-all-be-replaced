const { parse } = require("rss-to-json");
const player = require("play-sound")();

(async () => {
  try {
    const rss = await parse(
      "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR"
    );
    const poeticTrends = rss?.items?.map((item) => {
      return `É preciso ${item?.title}`;
    });

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
      "é preciso colher as flores",
      "de que rezam velhos autores.",
    ];

    const lastStanza = `É preciso viver com os homens\né preciso não assassiná-los,\né preciso ter mãos pálidas\ne anunciar O FIM DO MUNDO.`;

    const newPoem = [];

    poemArray.forEach((verse) => {
      newPoem.push(verse);
      if (Math.random() > 0.5) {
        const verseIndex = Math.floor(Math.random() * poeticTrends.length);
        newPoem.push(poeticTrends[verseIndex]);
        poeticTrends.splice(verseIndex, 1);
      }
    });
    newPoem.push(lastStanza);
    const finalPoem = newPoem.join("\n");

    const possibleVoices = [
      "21m00Tcm4TlvDq8ikWAM",
      "29vD33N1CtxCmqQRPOHJ",
      "2EiwWnXFnvU5JabPnv8n",
      "5Q0t7uMcjvnagumLfvZi",
      "AZnzlk1XvdvUeBnXmlld",
      "CYw3kZ02Hs0563khs1Fj",
      "D38z5RcWu1voky8WS1ja",
      "EXAVITQu4vr4xnSDxMaL",
      "ErXwobaYiN019PkySvjV",
      "GBv7mTt0atIp3Br8iCZE",
      "IKne3meq5aSn9XLyUdCD",
      "JBFqnCBsd6RMkjVDRZzb",
      "LcfcDJNUP1GQjkzn1xUU",
      "MF3mGyEYCl7XYWbV9V6O",
      "N2lVS1w4EtoT3dr4eOWO",
      "ODq5zmih8GrVes37Dizd",
      "SOYHLrjzK2X1ezoPC6cr",
      "TX3LPaxmHKxFdv7VOQHJ",
      "ThT5KcBeYPX3keUQqHPh",
      "TxGEqnHWrfWFTfGW9XjX",
      "VR6AewLTigWG4xSOukaG",
      "XB0fDUnXU5powFXDhCwa",
      "XrExE9yKIg1WjnnlVkGX",
      "Yko7PKHZNXotIFUBG7I9",
      "ZQe5CZNOzWyzPSCn5a3c",
      "Zlb1dXrM653N07WRdFW3",
      "bVMeCyTHy58xNoL34h3p",
      "flq6f7yk4E4fJM5XTYuZ",
      "g5CIjZEefAph4nQFvHAz",
      "jBpfuIE2acCO8z3wKNLl",
      "jsCqWAovK2LkecY7zXl4",
      "knrPHWnBmmDHMoiMeP3l",
      "oWAxZDx7w5VEj9dCyTzz",
      "onwK4e9ZLuTAKqWW03F9",
      "pFZP5JQG7iQjIQuC4Bku",
      "pMsXgVXv3BLzUgSXRplE",
      "pNInz6obpgDQGcFmaJgB",
      "piTKgcLEGmPE4e6mEKli",
      "pqHfZKP75CvOlQylNhV4",
      "t0jbNlBVZ17f02VDIeMI",
      "wViXBPUzp2ZZixB1xQuM",
      "yoZ06aMxZJJ28mfd3POQ",
      "z9fAnlkpzviPz146aGWa",
      "zcAOhNBS3c14rBihAFp1",
      "zrHiDhphv9ZnVXBqCLjz",
    ];

    const finalVoice =
      possibleVoices[Math.floor(Math.random() * possibleVoices.length)];

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${finalVoice}?output_format=mp3_22050_32`;

    const options = {
      method: "POST",
      headers: {
        "xi-api-key": "25cdb76f06803afa274978628dfed638",
        "Content-Type": "application/json",
      },
      body: `{"model_id":"eleven_multilingual_v2","text": ${JSON.stringify(
        finalPoem
      )}, "voice_settings":{"similarity_boost":0.5,"stability":0.75,"style":0,"use_speaker_boost":true}}`,
    };

    fetch(url, options)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Convert ArrayBuffer to Buffer
        const buffer = Buffer.from(arrayBuffer);
        require("fs").writeFileSync("audio.mp3", buffer);
      })
      .catch((err) => console.error(err));
  } catch (error) {
    console.error("Error:", JSON.parse(error));
  }
})();
