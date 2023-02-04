import { writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { stripHtml } from "string-strip-html";
import { BASE_URL } from "./constants.js";

const MAX_ATTEMPTS = 5;

export default async function getTalks(year, month) {
  const talkListing = getTalkListingForConference(year, month);

  const talks = talkListing
    .filter(filterSessionBreakouts)
    .map((talk) => ({ ...talk, month, year }))
    .map(getTalkContent);

  const fileName = `case2/output/${year}-${month}.json`;

  return Promise.all(talks)
    .then((talks) => writeFileSync(fileName, JSON.stringify(talks, null, 4)))
    .then(() => console.info(`\n${fileName} is written`));
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

async function getTalkListingForConference(year, month) {
  const indexUrl = `${BASE_URL}/study/general-conference/${year}/${month}?lang=eng`;
  console.info("Fetching ", indexUrl);

  const contents = await getTextFromUrl(indexUrl);

  return extractTalkListingsFromDOM(contents);
}

export function extractTalkListingsFromDOM(string) {
  const dom = new JSDOM(string);

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

    return {
      ...talk,
      content: extractTalkContent(content),
    };
  } catch (error) {
    console.info("Failed to get talk content for ", JSON.stringify(talk));
    console.error(error);
  }

  return talk;
}

export function extractTalkContent(string) {
  const dom = new JSDOM(string);
  const cleanedText = stripHtml(
    dom.window.document.querySelector(".body-block").innerHTML,
    config
  ).result;

  return cleanedText;
}

const config = {
  stripTogetherWithTheirContents: [
    "script",
    "style",
    "xml",
    "sup",
    "figure",
    "cite",
  ],
};
