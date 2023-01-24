import { removeStopwords } from "stopword";
import data from "../data";
import { filterData, FilterState } from "../filters";

export default function getWordCounts(filters: FilterState) {
  return new Promise((resolve) => setTimeout(resolve, 10))
    .then(() => filterData(data, filters))
    .then((talks) => removeStopwords(getAllWords(talks)).filter(Boolean))
    .then((words) => orderByFrequency(words, 300));
}

function getAllWords(talks: ReturnType<typeof filterData>) {
  return talks
    .map((talk) => talk.content || "")
    .map((talk) => talk.replaceAll(/[^a-zA-Z-' ]/gi, ""))
    .join(" ")
    .replaceAll("\n", "")
    .split(" ");
}

function orderByFrequency(words: Array<string>, limit: number) {
  const frequencyMap = words.reduce<Record<string, number>>(
    (acc, word: string) => {
      acc[word] = acc[word] || 0;
      acc[word]++;

      return acc;
    },
    {}
  );

  return Object.keys(frequencyMap)
    .sort((a, b) => frequencyMap[b] - frequencyMap[a])
    .slice(0, 300)
    .map((word, index) => ({
      key: word,
      rank: index + 1,
      _word: word,
      count: frequencyMap[word],
    }));
}
