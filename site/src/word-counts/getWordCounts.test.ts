import getWordCounts from "./getWordCounts";

jest.mock("../shared/data", () => {
  function createTalk(content: string) {
    return {
      speaker: "Speaker A",
      title: "Title 1",
      url: "https://",
      year: 2021,
      month: 4,
      content,
    };
  }

  return {
    __esModule: true,
    default: [
      createTalk("President Nelson likes to read books."),
      createTalk("President Hinckley's favorite book is the Book of Mormon."),
      createTalk("It's not Book of Mormons; it's Books of Mormon"),
      createTalk("The book about presidents"),
    ],
    speakers: ["Speaker A"],
  };
});

const filters = {
  speaker: "Speaker A",
  years: { start: 1900, end: 2023 },
};

test("correctly counts the unique words", async () => {
  const result = await getWordCounts(filters);
  expect(result).toEqual([
    { key: "book", rank: 1, label: "book", count: 4 },
    { key: "president", rank: 2, label: "President", count: 2 },
    { key: "books", rank: 3, label: "books", count: 2 },
    { key: "mormon", rank: 4, label: "Mormon", count: 2 },
    { key: "it's", rank: 5, label: "It's", count: 2 },
    { key: "nelson", rank: 6, label: "Nelson", count: 1 },
    { key: "likes", rank: 7, label: "likes", count: 1 },
    { key: "read", rank: 8, label: "read", count: 1 },
    { key: "hinckley's", rank: 9, label: "Hinckley's", count: 1 },
    { key: "favorite", rank: 10, label: "favorite", count: 1 },
    { key: "not", rank: 11, label: "not", count: 1 },
    { key: "mormons", rank: 12, label: "Mormons", count: 1 },
    { key: "presidents", rank: 13, label: "presidents", count: 1 },
  ]);
});
