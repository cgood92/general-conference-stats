import data from "../shared/data";

export default function getVocabularySize() {
  return new Promise((resolve) => setTimeout(resolve, 10))
    .then(() => getCountOfWordsPerSpeaker(data).filter(Boolean))
    .then((sizes) => orderByFrequency(sizes));
}

function getCountOfWordsPerSpeaker(talks: typeof data) {
  const wordsBySpeaker = talks.reduce<
    Record<string, { distinctWords: string[]; totalWordCount: number }>
  >((acc, talk) => {
    const previous = acc[talk.speaker];

    const content = (talk.content || "")
      .replaceAll(/[^a-zA-Z-'’ ]/gi, " ")
      .toLowerCase();
    const words = content.split(" ").filter((word) => word.length > 2);

    const wordCount = (previous?.totalWordCount || 0) + words.length;
    const distinctWords = Array.from(
      new Set((previous?.distinctWords || []).concat(words))
    );

    acc[talk.speaker] = { distinctWords, totalWordCount: wordCount };
    return acc;
  }, {});

  return Object.keys(wordsBySpeaker).map((speaker) => ({
    key: speaker,
    speaker,
    distinct: wordsBySpeaker[speaker].distinctWords.length,
    total: wordsBySpeaker[speaker].totalWordCount,
  }));
}

function orderByFrequency(sizes: ReturnType<typeof getCountOfWordsPerSpeaker>) {
  return sizes
    .sort((a, b) => b.distinct - a.distinct)
    .map((size, index) => ({
      ...size,
      rank: index + 1,
    }));
}
