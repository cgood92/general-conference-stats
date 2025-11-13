import { buildYearsArray, filterData } from "./filters";

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
    session: "Session A",
    url: "https://",
    year,
    month,
    content,
    dateKey,
  };
}

const data = [
  createTalk(2009, "10", "Speaker A", "Talk 1"),
  createTalk(2010, "04", "Speaker B", "Talk 2"),
  createTalk(2010, "10", "Speaker C", "Talk 3"),
  createTalk(2011, "04", "Speaker A", "Talk 4"),
  createTalk(2011, "10", "Speaker B", "Talk 5"),
  createTalk(2012, "04", "Speaker B", "Talk 5"),
];

describe("filterData", () => {
  it("no speaker specified, include all", () => {
    const filters = {
      speaker: "",
      years: { start: 2009, end: 2011.5 },
    };

    expect(filterData(data, filters)).toHaveLength(5);
  });

  it("filter by speaker", () => {
    const filters = {
      speaker: "Speaker B",
      years: { start: 2009, end: 2011.5 },
    };

    expect(filterData(data, filters)).toHaveLength(2);
  });

  describe("filter by years", () => {
    it.each([
      { start: 2009, end: 2010, expected: 2 },
      { start: 2009, end: 2011, expected: 4 },
      { start: 2010, end: 2011, expected: 3 },
      { start: 2011, end: 2011, expected: 1 },
      { start: 2010.5, end: 2010.5, expected: 1 },
      { start: 2010.5, end: 2011, expected: 2 },
      { start: 2010.5, end: 2011.5, expected: 3 },
      { start: 2010.5, end: 2010.5, expected: 1 },
      { start: 2010.5, end: 2011.5, expected: 3 },
      { start: 2010, end: 2011.5, expected: 4 },
    ])("%j", ({ start, end, expected }) => {
      const filters = {
        speaker: "",
        years: {
          start,
          end,
        },
      };

      expect(filterData(data, filters)).toHaveLength(expected);
    });
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
