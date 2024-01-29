import { execSync } from "child_process";
import generateDefaultLines from "./generateDefaultLines.mjs";
import generateFinalStanza from "./generateFinalStanza.mjs";
import generateGoogleLines from "./generateGoogleLines.mjs";
import generateTextPoem from "./generateTextPoem.mjs";
import generateAudioPoem from "./generatePoem.mjs";
import chalk from "chalk";

(() => {
  const arg = process.argv[2];
  if (!arg) {
    throw new Error(
      chalk.red.bold(
        "expects one of the arguments: defaultLines | finalStanza | audioPoem | googleLines | textPoem | init.\nUse 'init' if it's the first time running"
      )
    );
  }
  if (
    arg != "textPoem" &&
    (!process.env.ELEVENLABS_API_KEY ||
      process.env.ELEVENLABS_API_KEY == "API_KEY")
  ) {
    throw new Error(
      chalk.red.bold(
        "To generate the audio poems, you must create a .env file and insert your elevenLabs API Key.\n Check .env.example to see the env name"
      )
    );
  }
  const argMap = {
    defaultLines: async () => {
      generateDefaultLines();
    },
    finalStanza: async () => {
      generateFinalStanza();
    },
    googleLines: async () => {
      generateGoogleLines();
    },
    textPoem: async () => {
      generateTextPoem();
    },
    audioPoem: async () => {
      generateAudioPoem();
    },
    init: async () => {
      console.log(
        chalk.blueBright.bold(
          "starting poem generation. This might take a while"
        )
      );
      console.log(
        chalk.redBright.bold(
          "BEWARE: THIS WILL CONSUME A LOT OF CHARACTER FROM YOUR ELEVENLABS SUBSCRIPTION."
        )
      );
      await generateDefaultLines();
      await generateFinalStanza();
      execSync("node ./generatePoem.mjs", { stdio: "inherit" });
    },
  };

  if (!argMap[arg]) {
    throw new Error(
      "expects one of the arguments: defaultLines | finalStanza | audioPoem | googleLines | textPoem | init.\nUse 'init' if it's the first time running"
    );
  }

  argMap[arg]();
})();
