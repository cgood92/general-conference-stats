import React, { useEffect, useState } from "react";
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import Crunching from "../crunching";
import type { FilterState } from "../filters";
import getWordCounts from "./getWordCounts";
import "./index.css";

type WordCountProps = {
  filters: FilterState;
};

type WordCountItem = {
  key: string;
  count: number;
  rank: number;
  _word: string;
};

export default function WordCount({ filters }: WordCountProps) {
  const [loading, setLoading] = useState(true);
  const [wordCountArray, setWordCountArray] = useState<Array<WordCountItem>>(
    []
  );

  const columns = [
    { name: "Rank", key: "rank" },
    { name: "Word", key: "_word" },
    { name: "Count", key: "count" },
  ];

  useEffect(() => {
    setLoading(true);
    getWordCounts(filters).then((wordCountArray) => {
      setWordCountArray(wordCountArray);
      setLoading(false);
    });
  }, [filters]);

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
          {(column) => <Column>{column.name}</Column>}
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
