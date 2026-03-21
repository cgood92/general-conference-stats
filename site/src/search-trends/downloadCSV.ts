import { SearchResult } from "./getTrendData";
import { getPlainTextSnippetFromResults } from "./getSnippetFromResults";

function escapeCSVField(field: string): string {
  // If the field contains a double quote, comma, or newline, it needs to be quoted.
  // We also replace any internal double quotes with two double quotes ("").
  if (field.includes("\"") || field.includes(",") || field.includes("\n")) {
    return `"${field.replace(/"/g, "\"\"")}"`;
  }
  return field;
}

export function convertDataToCSV(data: SearchResult[][]): string | undefined {
  const flattenedData = data.flat().reverse();

  if (flattenedData.length === 0) {
    return;
  }

  const headers = ["Talk", "Speaker", "Year", "Search results"];
  
  const rows = flattenedData.map((result) => {
    const talk = result.talk.title;
    const speaker = result.talk.speaker;
    const year = result.talk.year.toString();
    const snippet = getPlainTextSnippetFromResults(result.results);

    return [
      escapeCSVField(talk),
      escapeCSVField(speaker),
      escapeCSVField(year),
      escapeCSVField(snippet),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export function downloadSearchResultsCSV(data: SearchResult[][]) {
  const csvContent = convertDataToCSV(data);
  if (!csvContent) return;
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "search_results.csv");
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
