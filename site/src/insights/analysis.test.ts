import {
  selectBaseline,
  languageInsights,
  Conference,
  sharedLanguage,
} from "./analysis";
const talk = (
  id: number,
  session: string,
  words: number,
  terms: Record<string, number>
) => ({
  id,
  session,
  words,
  terms,
  references: [],
  invitations: [],
});
const conferences: Conference[] = [
  {
    key: 2025,
    talks: [talk(0, "Saturday Morning Session", 100, { temple: 1, elohim: 0 })],
  },
  {
    key: 2025.5,
    talks: [talk(1, "Sunday Morning Session", 200, { temple: 2 })],
  },
  {
    key: 2026,
    talks: [talk(2, "Saturday Morning Session", 100, { temple: 4, elohim: 2 })],
  },
  {
    key: 2026.5,
    talks: [talk(3, "Saturday Morning Session", 100, { temple: 10 })],
  },
];
test("comparison baselines exclude the target and respect chronology", () => {
  expect(selectBaseline(conferences, 2026, "all", "").map((t) => t.id)).toEqual(
    [0, 1, 3]
  );
  expect(
    selectBaseline(conferences, 2026, "past", "").map((t) => t.id)
  ).toEqual([0, 1]);
  expect(
    selectBaseline(conferences, 2026, "previous", "").map((t) => t.id)
  ).toEqual([1]);
  expect(
    selectBaseline(conferences, 2026, "session", "").map((t) => t.id)
  ).toEqual([0, 3]);
  expect(selectBaseline(conferences, 2025, "previous", "")).toEqual([]);
});
test("normalizes for text length and keeps genuinely rare appearances", () => {
  const result = languageInsights(conferences[2].talks, conferences[1].talks);
  expect(result.find((x) => x.term === "temple")?.ratio).toBe(4);
  expect(result.find((x) => x.term === "elohim")?.baselineCount).toBe(0);
  expect(result.find((x) => x.term === "elohim")?.count).toBe(2);
});
test("returns no comparisons for an empty baseline instead of treating it as zero usage", () => {
  expect(languageInsights(conferences[0].talks, [])).toEqual([]);
});
test("shared emphasis is available even without a comparison baseline", () => {
  const result = sharedLanguage(
    [
      talk(0, "Morning", 100, { faith: 2 }),
      talk(1, "Morning", 100, { faith: 1 }),
    ],
    []
  );
  expect(result.find((f) => f.term === "faith")?.talks).toBe(2);
});
