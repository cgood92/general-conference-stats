import { writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { stripHtml } from "string-strip-html";
import { BASE_URL } from "./constants.js";

const MAX_ATTEMPTS = 5;

export default async function getTalks(year, month) {
  const indexUrl = `${BASE_URL}/study/general-conference/${year}/${month}?lang=eng`;
  console.info("Fetching ", indexUrl);

  const contents = await getTextFromUrl(indexUrl);
  const dom = new JSDOM(contents);

  const talks = getTalksInDOM(dom)
    .filter(filterSessionBreakouts)
    .map((talk) => ({ ...talk, month, year }))
    .map(getTalkContent);

  return Promise.all(talks).then((talks) => {
    const fileName = `case2/output/${year}-${month}.json`;
    writeFileSync(fileName, JSON.stringify(talks, null, 4));
    console.info(`\n${fileName} is written`);
  });
}

function getTextFromUrl(url, attempts = 0) {
  return fetch(url)
    .then((response) => response.text())
    .catch((error) => {
      console.info(`Error fetching (attempt ${attempts + 1})`, url);
      console.error(error);

      if (attempts < MAX_ATTEMPTS) {
        return getTextFromUrl(url, attempts + 1);
      } else {
        throw `Tried ${MAX_ATTEMPTS} times to get ${url}` + url;
      }
    });
}

function getTalksInDOM(dom) {
  return Array.from(dom.window.document.querySelectorAll("li a p.title")).map(
    (n) => {
      const title = n.textContent;
      const url = `${BASE_URL}${n.closest("a").getAttribute("href")}`;
      const speaker = n.closest("a").querySelector("h6 p")?.textContent;
      const session = n
        .closest("ul.doc-map")
        .parentNode.querySelector(".title").textContent;

      return { session, speaker, title, url };
    }
  );
}

function filterSessionBreakouts(talk) {
  return !talk.title.includes("Session");
}

async function getTalkContent(talk) {
  try {
    const content = await getTextFromUrl(talk.url);
    console.info(`Fetched: ${talk.url}`);

    const dom = new JSDOM(content);
    const cleanedText = stripHtml(
      dom.window.document.querySelector(".body-block").innerHTML,
      config
    ).result;

    return {
      ...talk,
      content: cleanedText,
    };
  } catch (error) {
    console.info("Failed to get talk content for ", JSON.stringify(talk));
    console.error(error);
  }

  return talk;
}

const config = {
  stripTogetherWithTheirContents: [
    "script",
    "style",
    "xml",
    "a",
    "figure",
    "cite",
  ],
};
