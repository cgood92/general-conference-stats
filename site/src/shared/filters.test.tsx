import { buildYearsArray, filterData } from "./filters";

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

const data = [
  createTalk(2009, "Speaker A", "Talk 1"),
  createTalk(2010, "Speaker B", "Talk 2"),
  createTalk(2010, "Speaker C", "Talk 3"),
  createTalk(2011, "Speaker A", "Talk 4"),
  createTalk(2011, "Speaker B", "Talk 5"),
];

describe("filterData", () => {
  it("no speaker specified, include all", () => {
    const filters = {
      speaker: "",
      years: { start: 2009, end: 2011 },
    };

    expect(filterData(data, filters)).toHaveLength(5);
  });

  it("filter by speaker", () => {
    const filters = {
      speaker: "Speaker B",
      years: { start: 2009, end: 2011 },
    };

    expect(filterData(data, filters)).toHaveLength(2);
  });

  it("filter by years", () => {
    const filters = {
      speaker: "",
      years: { start: 2009, end: 2010 },
    };

    expect(filterData(data, filters)).toHaveLength(3);
  });

  it("filter by speaker and years", () => {
    const filters = {
      speaker: "Speaker A",
      years: { start: 2009, end: 2010 },
    };

    expect(filterData(data, filters)).toHaveLength(1);
  });
});

describe("buildYearsArray", () => {
  it("builds correct array", () => {
    expect(buildYearsArray(1990, 1992)).toEqual([1990, 1991, 1992]);
  });

  it("a single year is fine", () => {
    expect(buildYearsArray(1990, 1990)).toEqual([1990]);
  });
});
