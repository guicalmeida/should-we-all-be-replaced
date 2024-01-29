import { execSync } from "child_process";
import generateDefaultLines from "./generateDefaultLines.mjs";
import generateFinalStanza from "./generateFinalStanza.mjs";
import generateGoogleLines from "./generateGoogleLines.mjs";
import generateTextPoem from "./generateTextPoem.mjs";

(() => {
  const arg = process.argv[2];
  if (!arg) {
    throw new Error(
      "expects one of the arguments: defaultLines | finalStanza | googleLines | textPoem | init.\nUse 'init' if it's the first time running"
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
    init: async () => {
      console.log("starting poem generation. This might take a while");
      await generateDefaultLines();
      await generateFinalStanza();
      execSync("node ./generatePoem.mjs", { stdio: "inherit" });
    },
  };

  if (!argMap[arg]) {
    throw new Error(
      "expects one of the arguments: defaultLines | finalStanza | googleLines | textPoem | init.\nUse 'init' if it's the first time running"
    );
  }

  argMap[arg]();
})();
