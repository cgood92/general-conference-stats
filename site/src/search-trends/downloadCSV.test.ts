import { convertDataToCSV } from "./downloadCSV";
import { SearchResult } from "./getTrendData";

describe("convertDataToCSV", () => {
  it("converts basic data to CSV correctly", () => {
    const mockData: SearchResult[][] = [
      [
        {
          talk: {
            title: "Test Talk",
            speaker: "John Doe",
            year: 2025,
            url: "http://example.com/test-talk",
            content: "This is a test content with the word obvious in it.",
            dateKey: 2025,
            session: "Saturday Morning",
            month: "April",
          },
          // Mock RegExpMatchArray is just an array with extra properties
          results: [Object.assign(["obvious"], { index: 37, input: "This is a test content with the word obvious in it." }) as unknown as RegExpMatchArray],
        },
      ],
    ];

    const csvContent = convertDataToCSV(mockData);

    expect(csvContent).toBeDefined();
    expect(csvContent).toContain("Talk,Speaker,Year,Search results");
    expect(csvContent).toContain("Test Talk,John Doe,2025");
    expect(csvContent).toContain("...This is a test content with the word obvious in it...");
  });

  it("escapes fields containing commas or quotes", () => {
    const mockData: SearchResult[][] = [
      [
        {
          talk: {
            title: "\"Quoted\" Talk, with commas",
            speaker: "Jane, Smith",
            year: 2024,
            url: "http://example.com/quoted-talk",
            content: "This is obvious, right?",
            dateKey: 2024,
            session: "Sunday Afternoon",
            month: "October",
          },
          results: [Object.assign(["obvious"], { index: 8, input: "This is obvious, right?" }) as unknown as RegExpMatchArray],
        },
      ],
    ];

    const csvContent = convertDataToCSV(mockData);

    // Should be quoted and internal quotes should be doubled
    expect(csvContent).toContain("\"\"\"Quoted\"\" Talk, with commas\"");
    expect(csvContent).toContain("\"Jane, Smith\"");
    // Snippet will contain commas
    expect(csvContent).toContain("\"...This is obvious, right?...\"");
  });

  it("returns undefined for empty data", () => {
    expect(convertDataToCSV([])).toBeUndefined();
    expect(convertDataToCSV([[]])).toBeUndefined();
  });
});
