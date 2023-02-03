import getVocabularySize from "./getVocabularySize";

jest.mock("../shared/data", () => [
  {
    speaker: "Speaker A",
    title: "Title 1",
    url: "https://",
    year: 2021,
    month: 4,
    content: "Dog cow pig. Chicken COW dog; pig. Pig.",
  },
  {
    speaker: "Speaker B",
    title: "Title 2",
    url: "https://",
    year: 2021,
    month: 4,
    content: "Cookie brownie cookie ice cream ice-cream",
  },
  {
    speaker: "Speaker A",
    title: "Title 3",
    url: "https://",
    year: 2022,
    month: 10,
    content: "dog cat rat cow rat snake",
  },
  {
    speaker: "Speaker A",
    title: "Title 3",
    url: "https://",
    year: 2022,
    month: 10,
    content: "turtle",
  },
]);

test("calculates the correct vocabulary size", async () => {
  expect(await getVocabularySize()).toEqual([
    {
      key: "Speaker A",
      speaker: "Speaker A",
      distinct: 8,
      total: 15,
      rank: 1,
    },
    {
      key: "Speaker B",
      speaker: "Speaker B",
      distinct: 5,
      total: 6,
      rank: 2,
    },
  ]);
});
