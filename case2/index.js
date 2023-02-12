import getTalks from "./getTalks.js";

async function run() {
  for (let year = 1971; year <= 2022; year++) {
    console.info("\n\nRunning year ", year);
    await getTalks(year, "04");
    await getTalks(year, "10");
  }
}

run();
