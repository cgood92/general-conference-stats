import { writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { stripHtml } from "string-strip-html";
import { BASE_URL } from "./constants.js";
import filterValidTalks from "./filterValidTalks.js";
import { extractTalkReferences } from "./getTalkReferences.js";

const MAX_ATTEMPTS = 5;

export default async function getTalks(year, month) {
  const talkListing = await getTalkListingForConference(year, month);

  const talks = talkListing
    .filter(filterValidTalks)
    .map((talk) => ({
      ...talk,
      month,
      year,
      dateKey: makeDateKey(month, year),
    }))
    .map(getTalkContent);

  const fileName = `case2/output/${year}-${month}.json`;

  return Promise.all(talks)
    .then((talks) => writeFileSync(fileName, JSON.stringify(talks, null, 4)))
    .then(() => console.info(`\n${fileName} is written`));
}

export function getTextFromUrl(url, attempts = 0) {
  return fetch(url, { signal: AbortSignal.timeout(20000) })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP ${response.status} fetching ${url}`);
      return response.text();
    })
    .catch((error) => {
      console.info(`Error fetching (attempt ${attempts + 1})`, url);
      console.error(error);

      if (attempts < MAX_ATTEMPTS) {
        return getTextFromUrl(url, attempts + 1);
      } else {
        throw new Error(
          `Failed to fetch ${url} after ${attempts + 1} attempts`,
          { cause: error }
        );
      }
    });
}

async function getTalkListingForConference(year, month) {
  const indexUrl = `${BASE_URL}/study/general-conference/${year}/${month}?lang=eng`;
  console.info("Fetching ", indexUrl);

  const contents = await getTextFromUrl(indexUrl);

  const listing = extractTalkListingsFromDOM(contents);
  if (!listing.length) throw new Error(`No talks found at ${indexUrl}`);
  return listing;
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

async function getTalkContent(talk) {
  const html = await getTextFromUrl(talk.url);
  const references = extractTalkReferences(html);
  if (references.coverage === "unavailable")
    throw new Error(`Missing talk body: ${talk.url}`);
  console.info(`Fetched: ${talk.url}`);
  return { ...talk, content: extractTalkContent(html), references };
}

export function extractTalkContent(string) {
  const dom = new JSDOM(string);
  const cleanedText = stripHtml(
    dom.window.document.querySelector(".body-block").innerHTML,
    config
  ).result;

  return cleanedText;
}

function makeDateKey(month, year) {
  if (month === "10") {
    return year + 0.5;
  }

  return year;
}

const config = {
  stripTogetherWithTheirContents: ["script", "style", "xml", "sup", "figure"],
};
