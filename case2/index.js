import { execFileSync } from "node:child_process";
import getTalks from "./getTalks.js";
import refreshReferences from "./refreshReferences.js";

async function run() {
  if (process.argv.includes("--references-only")) {
    await refreshReferences();
  } else {
    for (let year = 1971; year <= 2026; year++) {
      console.info("\n\nRunning year ", year);
      await getTalks(year, "04");
      await getTalks(year, "10");
    }
  }
  // References are part of the scrape; rebuild the fingerprint from that evidence.
  execFileSync("python3", ["analysis/build_insights.py"], { stdio: "inherit" });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
