import { buildYearsArray } from "../shared/filters";
import { getSearchResults, getTrendData } from "./getTrendData";

jest.mock("../shared/data", () => {
  function createTalk(year: number, speaker: string, content: string) {
    return {
      speaker,
      title: "Title 1",
      url: "https://",
      year,
      month: 4,
      content,
    };
  }

  return {
    __esModule: true,
    default: [
      createTalk(
        2009,
        "Speaker A",
        "My beloved brothers and sisters:\nI am deeply grateful for the privilege of meeting with you once again in a general conference of the Lord’s church."
      ),
      createTalk(
        2020,
        "Speaker B",
        "My dear brothers and sisters, welcome to general conference! I have looked forward to this day with great anticipation."
      ),
      createTalk(
        2021,
        "Speaker C",
        "My beloved brothers and sisters, it is a joy to be with you again in another general conference."
      ),
      createTalk(
        2022,
        "Speaker D",
        "My brothers and sisters, as we gather in another general conference, I am pleased to report that the Church continues to grow in strength and influence."
      ),
    ],
    speakers: ["Speaker A", "Speaker B", "Speaker C", "Speaker D"],
  };
});

const filters = {
  speaker: "",
  years: { start: 2009, end: 2022 },
};

describe("getSearchResults", () => {
  it("searching for a term yields results", async () => {
    const [firstTermResults] = await getSearchResults(filters, [
      "general conference",
    ]);

    expect(firstTermResults).toHaveLength(4);
  });

  it("regex works", async () => {
    const [firstTermResults, secondTermResults] = await getSearchResults(
      filters,
      ["ge.eral", "confe?renc[c-k]"]
    );

    expect(firstTermResults).toHaveLength(4);
    expect(secondTermResults).toHaveLength(4);
  });

  it("multiple results in a talk allowed", async () => {
    const [firstTermResults] = await getSearchResults(filters, ["and"]);

    expect(firstTermResults[3].results).toHaveLength(2);
  });
});

describe("getTrendData", () => {
  it("builds a series for plotting", async () => {
    const results = await getSearchResults(filters, ["general", "conference"]);

    const series = await getTrendData(
      results,
      ["general", "conference"],
      buildYearsArray(2009, 2022)
    );

    expect(series).toEqual([
      {
        name: "general",
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      },
      {
        name: "conference",
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      },
    ]);
  });
});
