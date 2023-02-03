import { removeStopwords } from "stopword";
import data from "../shared/data";
import { filterData, FilterState } from "../shared/filters";

export default function getWordCounts(filters: FilterState) {
  return new Promise((resolve) => setTimeout(resolve, 10))
    .then(() => filterData(data, filters))
    .then((talks) => removeStopwords(getAllWords(talks)).filter(Boolean))
    .then((words) => orderByFrequency(words, 300));
}

function getAllWords(talks: ReturnType<typeof filterData>) {
  return talks
    .map((talk) => talk.content || "")
    .map((talk) => talk.replaceAll(/[^a-zA-Z-'’ ]/gi, " "))
    .join(" ")
    .split(" ")
    .filter((word) => word.length > 2);
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

  const insensitiveFrequencyMap = combineStemmedWords(frequencyMap);

  return Object.keys(insensitiveFrequencyMap)
    .sort(
      (a, b) =>
        insensitiveFrequencyMap[b].count - insensitiveFrequencyMap[a].count
    )
    .slice(0, limit)
    .map((key, index) => ({
      key,
      rank: index + 1,
      label: getShortLabel(insensitiveFrequencyMap[key].words),
      count: insensitiveFrequencyMap[key].count,
    }));
}

type WordMap = {
  words: string[];
  count: number;
};

function combineStemmedWords(object: Record<string, number>) {
  const newObject: Record<string, WordMap> = {};

  Object.keys(object).forEach((word) => {
    const key = word.toLowerCase();

    let existingKey = newObject[key];

    if (existingKey) {
      existingKey.words.push(word);
      existingKey.count += object[word];
    }

    if (!existingKey) {
      newObject[key] = {
        words: [word],
        count: object[word],
      };
    }
  });

  return newObject;
}

function getShortLabel(words: string[]) {
  return words[0];
}