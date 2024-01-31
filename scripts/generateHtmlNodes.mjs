import { lastStanza, poemArray, prefixes } from "../helpers/values.mjs";

export function combineVerses(originalPoemArr, googlePoemArr) {
    const combinedArray = [];
  
    originalPoemArr.forEach((defaultLine, i) => {
      const addGoogleLine = () => {
        if (googlePoemArr.length > 0) {
          const thisLineIndex = Math.floor(Math.random() * googlePoemArr.length);
          combinedArray.push(googlePoemArr[thisLineIndex]);
          googlePoemArr.splice(thisLineIndex, 1);
        }
      };
  
      combinedArray.push(defaultLine);
      addGoogleLine();
  
      while (googlePoemArr.length > 0 && Math.random() > 0.4) {
        addGoogleLine();
      }
    });
  
    while (googlePoemArr.length > 0) {
      combinedArray.push(googlePoemArr.shift());
    }
  
    return combinedArray;
  }

  
export async function generateHtmlPoem() {
    const trends = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftrends.google.com.br%2Ftrends%2Ftrendingsearches%2Fdaily%2Frss%3Fgeo%3DBR&api_key=cfgejxcykr9atwoo6attswajnxdibilby26vwjd6&count=20"
    )
      .then((response) => response.json())
      .then((data) => {
        return data.items.map((item) => item.title);
      });
  
    const poeticTrends = trends?.map((item) => {
      return `É preciso ${
        prefixes[Math.floor(Math.random() * prefixes.length)]
      } ${item}`;
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
  
    const textNodes = [];
  
    for (let i = 0; i < 10; i++) {
      const newTrends = remove30percentItems(poeticTrends);
      const newPoem = combineVerses(poemArray, newTrends);
  
      const finalPoemText = (
        "       " +
        newPoem.join("       ") +
        "       " +
        lastStanza.replace(/\n/g, "       ")
      ).toUpperCase();
  
      const textNode = document.createElement("p");
      textNode.textContent = finalPoemText;
  
      textNodes.push(textNode);
    }
    return textNodes;
  }
  