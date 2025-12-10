import { buildYearsArray } from "../shared/filters";
import { getSearchResults, getTrendData } from "./getTrendData";

jest.mock("../shared/data", () => {
  function createTalk(
    year: number,
    month: string,
    speaker: string,
    content: string
  ) {
    const dateKey = year + (month === "04" ? 0 : 0.5);
    return {
      speaker,
      title: "Title 1",
      url: "https://",
      year,
      month,
      content,
      dateKey,
    };
  }

  return {
    __esModule: true,
    default: [
      createTalk(
        2009,
        "04",
        "Speaker A",
        "My beloved brothers and sisters:\nI am deeply grateful for the privilege of meeting with you once again in a general conference of the Lord’s church."
      ),
      createTalk(
        2020,
        "04",
        "Speaker B",
        "My dear brothers and sisters, welcome to general conference! I have looked forward to this day with great anticipation."
      ),
      createTalk(
        2021,
        "10",
        "Speaker C",
        "My beloved brothers and sisters, it is a joy to be with you again in another general conference."
      ),
      createTalk(
        2022,
        "04",
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

    // 2009 to 2022 with half-year increments = 27 data points
    // Mock data: 2009 (index 0), 2020 (index 22), 2021.5 (index 25), 2022 (index 26)
    const expectedData = new Array(27).fill(0);
    expectedData[0] = 1; // 2009 April
    expectedData[22] = 1; // 2020 April
    expectedData[25] = 1; // 2021 October
    expectedData[26] = 1; // 2022 April

    expect(series).toEqual([
      {
        name: "general",
        data: expectedData,
      },
      {
        name: "conference",
        data: expectedData,
      },
    ]);
  });
});
