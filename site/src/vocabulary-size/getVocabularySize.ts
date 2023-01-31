import data from "../shared/data";

export default function getVocabularySize() {
  return new Promise((resolve) => setTimeout(resolve, 10))
    .then(() => getCountOfWordsPerSpeaker(data).filter(Boolean))
    .then((sizes) => orderByFrequency(sizes));
}

function getCountOfWordsPerSpeaker(talks: typeof data) {
  const distinctWordsBySpeaker = talks.reduce<Record<string, string[]>>(
    (acc, talk) => {
      const content = (talk.content || "")
        .replaceAll(/[^a-zA-Z-' ]/gi, "")
        .replaceAll("\n", "")
        .toLowerCase();
      const words = content.split(" ");
      const distinctWords = Array.from(
        new Set((acc[talk.speaker] || []).concat(words))
      );
      acc[talk.speaker] = distinctWords;
      return acc;
    },
    {}
  );

  return Object.keys(distinctWordsBySpeaker).map((speaker) => ({
    key: speaker,
    speaker,
    size: distinctWordsBySpeaker[speaker].length,
  }));
}

function orderByFrequency(sizes: ReturnType<typeof getCountOfWordsPerSpeaker>) {
  return sizes
    .sort((a, b) => b.size - a.size)
    .map((size, index) => ({
      ...size,
      rank: index + 1,
    }));
}
