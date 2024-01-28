import { execSync } from "child_process";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

const startTime = dayjs().set("hour", 8).set("minute", 0).set("second", 0);
const endTime = dayjs().set("hour", 23).set("minute", 59).set("second", 59);

let isDuringTheDay;

do {
  const currentTime = dayjs();
  isDuringTheDay = currentTime.isBetween(startTime, endTime);

  if (isDuringTheDay) {
    execSync(
      "node ./generatePoem.mjs && vlc -IDummy --play-and-exit ./output/poem_with_soundscape.mp3",
      { stdio: "inherit" }
    );
  }
} while (isDuringTheDay);
