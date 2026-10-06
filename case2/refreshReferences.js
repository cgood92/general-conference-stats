import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { getTextFromUrl } from "./getTalks.js";
import {
  extractTalkReferences,
  REFERENCE_METHOD_VERSION,
} from "./getTalkReferences.js";

/** Backfill structured source evidence without changing existing talk text. */
export default async function refreshReferences() {
  let checked = 0;
  let failed = 0;
  for (const file of readdirSync("case2/output")
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort()) {
    const path = `case2/output/${file}`;
    const talks = JSON.parse(readFileSync(path, "utf8"));
    const pending = talks.filter(
      (t) =>
        t.references?.methodVersion !== REFERENCE_METHOD_VERSION ||
        t.references?.coverage !== "source checked"
    );
    let cursor = 0;
    await Promise.all(
      Array.from({ length: 6 }, async () => {
        while (cursor < pending.length) {
          const talk = pending[cursor++];
          try {
            talk.references = extractTalkReferences(
              await getTextFromUrl(talk.url)
            );
            if (talk.references.coverage !== "source checked") failed++;
          } catch (error) {
            talk.references = {
              methodVersion: REFERENCE_METHOD_VERSION,
              coverage: "unavailable",
              notes: [],
              inlineScriptures: [],
            };
            failed++;
            console.error(`References unavailable: ${talk.url}`, error.message);
          }
          checked++;
        }
      })
    );
    if (pending.length) writeFileSync(path, JSON.stringify(talks, null, 4));
    console.log(
      `${file}: checked ${pending.length} source pages; ${checked} total, ${failed} incomplete`
    );
  }
  return { checked, failed };
}
