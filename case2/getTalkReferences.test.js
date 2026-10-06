import fs from "node:fs";
import { extractTalkReferences } from "./getTalkReferences.js";
test("keeps source links and associates a footnote with its quoted passage", () => {
  const result = extractTalkReferences(
    '<div class="body-block"><p id="p1">He taught us to pray.<sup><a href="#note1">1</a></sup></p></div><div class="notes"><li id="note1"><p>Russell M. Nelson, <a href="/study/general-conference/2024/04/47nelson">Rejoice</a>; <a class="scripture-ref" href="/study/scriptures/nt/john/3?id=p16">John 3:16</a>.</p></li></div>'
  );
  expect(result.notes[0].excerpt).toBe("He taught us to pray.");
  expect(result.notes[0].scriptures[0].label).toBe("John 3:16");
  expect(result.notes[0].links[0].url).toContain(
    "churchofjesuschrist.org/study/general-conference"
  );
  expect(result.coverage).toBe("source checked");
});
test("missing article markup is not reported as zero citations", () => {
  expect(extractTalkReferences("<h1>Unavailable</h1>").coverage).toBe(
    "unavailable"
  );
});
test("supports the live source format where the note link wraps superscript", () => {
  const result = extractTalkReferences(
    '<div class="body-block"><p id="p1">Come unto Christ.<a class="note-ref" href="#note1"><sup>1</sup></a></p></div><div class="notes"><li id="note1"><p>John 3:16.</p></li></div>'
  );
  expect(result.notes[0].excerpt).toBe("Come unto Christ.");
});

test("preserves canonical inline links and citation titles in older talks", () => {
  const refs = extractTalkReferences(
    '<div class="body-block"><p id="p1">Paul taught (<a href="/study/scriptures/nt/1-cor/13?id=p13#p13">1 Cor. 13:13</a>). See <cite>History of the Church</cite>.</p></div>'
  );
  expect(refs.inlineScriptures[0]).toMatchObject({
    label: "1 Cor. 13:13",
    paragraph: "p1",
  });
  expect(refs.inlineScriptures[0].excerpt).toContain("Paul taught");
  expect(refs.referenceText).toContain("History of the Church");
  expect(refs.coverage).toBe("source checked");
});
test("reports unresolved footnote anchors instead of claiming complete recovery", () => {
  const refs = extractTalkReferences(
    '<div class="body-block"><p>Quoted text.<a class="note-ref" href="#note9"><sup>9</sup></a></p></div>'
  );
  expect(refs.coverage).toBe("partial");
  expect(refs.diagnostics.unresolvedNoteIds).toEqual(["note9"]);
});
test("keeps references when notes use a footnotes container and repeated anchors", () => {
  const refs = extractTalkReferences(
    '<div class="body-block"><p id="p1">First.<sup><a href="#f1">1</a></sup></p><p id="p2">Second.<a class="note-ref" href="#f1"><sup>1</sup></a></p></div><section class="footnotes"><li id="f1">John 3:16</li></section>'
  );
  expect(refs.notes[0].contexts.map((x) => x.paragraph)).toEqual(["p1", "p2"]);
  expect(refs.diagnostics.unresolvedNoteIds).toEqual([]);
});

test.each([1971, 1980, 1990, 2000, 2010, 2020, 2026])(
  "extracts references from the verified %i source format",
  (year) => {
    const html = fs.readFileSync(
      `case2/fixtures/references-${year}.html`,
      "utf8"
    );
    const refs = extractTalkReferences(html);
    expect(refs.coverage).toBe("source checked");
    expect(refs.diagnostics.unresolvedNoteIds).toEqual([]);
    if (year <= 1990) {
      expect(refs.inlineScriptures.length).toBeGreaterThan(0);
      expect(refs.notes).toHaveLength(0);
    } else {
      expect(refs.notes.length).toBeGreaterThan(0);
      expect(refs.notes.some((n) => n.scriptures.length > 0)).toBe(true);
      expect(refs.notes.every((n) => n.excerpt)).toBe(true);
    }
  }
);
