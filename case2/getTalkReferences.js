import { JSDOM, VirtualConsole } from "jsdom";
import { BASE_URL } from "./constants.js";

export const REFERENCE_METHOD_VERSION = 3;

function cleanText(element) {
  const clone = element.cloneNode(true);
  clone
    .querySelectorAll(
      "script, style, xml, figure, sup, a.note-ref, .notes, .footnotes"
    )
    .forEach((node) => node.remove());
  // Retain <cite> text: it can identify the work or person being quoted.
  clone
    .querySelectorAll("p, blockquote, li, h2, h3")
    .forEach((node) => node.append("\n"));
  return clone.textContent
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
function sourceLink(anchor) {
  return {
    label: anchor.textContent.trim(),
    url: new URL(anchor.getAttribute("href"), BASE_URL).href,
  };
}
function anchorContext(anchor) {
  const paragraph = anchor.closest("p, blockquote, li") || anchor.parentElement;
  return { excerpt: cleanText(paragraph), paragraph: paragraph.id || "" };
}

export function extractTalkReferences(html) {
  const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() });
  try {
    const doc = dom.window.document;
    const body = doc.querySelector(".body-block");
    if (!body)
      return {
        methodVersion: REFERENCE_METHOD_VERSION,
        coverage: "unavailable",
        notes: [],
        inlineScriptures: [],
        referenceText: "",
      };
    const anchors = Array.from(
      body.querySelectorAll("a.note-ref, sup a[href]")
    );
    const noteId = (a) =>
      a.getAttribute("data-scroll-id") || a.getAttribute("href")?.split("#")[1];
    const notes = Array.from(
      doc.querySelectorAll(".notes li[id], .footnotes li[id]")
    ).map((note) => {
      const contexts = anchors
        .filter((a) => noteId(a) === note.id)
        .map(anchorContext);
      const context = contexts[0] || { excerpt: "", paragraph: "" };
      return {
        id: note.id,
        text: note.textContent.replace(/\u00a0/g, " ").trim(),
        ...context,
        contexts,
        links: Array.from(note.querySelectorAll("a[href]")).map(sourceLink),
        scriptures: Array.from(
          note.querySelectorAll('a[href*="/scriptures/"]')
        ).map(sourceLink),
      };
    });
    const ids = new Set(notes.map((n) => n.id));
    const unresolvedNoteIds = Array.from(
      new Set(anchors.map(noteId).filter((id) => !ids.has(id)))
    );
    const inlineScriptures = Array.from(
      body.querySelectorAll('a[href*="/scriptures/"]')
    )
      .filter((a) => !a.closest(".notes, .footnotes"))
      .map((a) => ({ ...sourceLink(a), ...anchorContext(a) }));
    return {
      methodVersion: REFERENCE_METHOD_VERSION,
      coverage: unresolvedNoteIds.length ? "partial" : "source checked",
      notes,
      inlineScriptures,
      referenceText: cleanText(body),
      diagnostics: {
        noteCount: notes.length,
        noteAnchorCount: anchors.length,
        unresolvedNoteIds,
        unmatchedNoteCount: notes.filter((n) => !n.contexts.length).length,
      },
    };
  } finally {
    dom.window.close();
  }
}
