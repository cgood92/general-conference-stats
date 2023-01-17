import React, { useEffect, useState } from "react";
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { removeStopwords } from "stopword";
import type { FilterState } from "./filters";
import data from "./data";
import "./wordCount.css";
import Crunching from "./crunching";

type WordCountProps = {
  filters: FilterState;
};

type WordCountItem = {
  key: string;
  rank: number;
  _word: string;
  count: number;
};

export default function WordCount({ filters }: WordCountProps) {
  const [loading, setLoading] = useState(true);
  const [wordCountArray, setWordCountArray] = useState<Array<WordCountItem>>(
    []
  );

  const columns = [
    { name: "Rank", key: "rank", width: 200 },
    { name: "Word", key: "_word" },
    { name: "Count", key: "count" },
  ];

  useEffect(() => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve))
      .then(() =>
        data.filter((talk) => {
          let validSpeaker = true;

          if (filters.speaker) {
            validSpeaker = talk.speaker === filters.speaker;
          }

          const validYear =
            talk.year <= filters.years.end && talk.year >= filters.years.start;

          return validSpeaker && validYear;
        })
      )
      .then((rows) =>
        removeStopwords(
          rows
            .map((talk) => talk.content || "")
            .join(" ")
            .replaceAll("\n", "")
            .split(" ")
        )
          .map((word) => word.replaceAll(/[^a-zA-Z]/gi, ""))
          .filter((word) => word)
          .reduce((acc: Record<string, number>, word: string) => {
            acc[word] = acc[word] || 0;
            acc[word]++;

            return acc;
          }, {})
      )
      .then((wordMap) =>
        Object.keys(wordMap)
          .sort((a, b) => wordMap[b] - wordMap[a])
          .slice(0, 300)
          .map((word, index) => ({
            key: word,
            rank: index + 1,
            _word: word,
            count: wordMap[word],
          }))
      )
      .then((wordCountArray) => {
        setWordCountArray(wordCountArray);
        setLoading(false);
      });
  }, [filters.speaker, filters.years.end, filters.years.start]);

  if (loading) {
    return <Crunching />;
  }

  return (
    <>
      <p className="stop-words">
        * Note that some{" "}
        <a
          href="https://github.com/fergiemcdowall/stopword/blob/main/src/stopwords_eng.js"
          rel="noreferrer"
          target="_blank"
        >
          stop-words
        </a>{" "}
        are being filtered out
      </p>
      <TableView
        aria-label="Word count table"
        marginTop="size-100"
        density="compact"
      >
        <TableHeader columns={columns}>
          {(column) => <Column width={column.width}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={wordCountArray}>
          {(item) => (
            <Row>
              {(columnKey) => {
                if (columnKey === "count") {
                  return (
                    <Cell>{Number(item[columnKey]).toLocaleString()}</Cell>
                  );
                }

                return <Cell>{item[columnKey as ColumnKey]}</Cell>;
              }}
            </Row>
          )}
        </TableBody>
      </TableView>
    </>
  );
}

type ColumnKey = "_word" | "count";
