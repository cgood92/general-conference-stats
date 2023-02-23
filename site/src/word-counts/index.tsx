import React, { useEffect, useState } from "react";
import {
  Cell,
  Column,
  Flex,
  Row,
  TableView,
  TableBody,
  TableHeader,
  View,
  Header,
} from "@adobe/react-spectrum";
import Crunching from "../shared/crunching";
import Filters from "../shared/filters";
import getWordCounts from "./getWordCounts";
import useParameters from "../shared/useParameters";
import "./index.css";

type WordCountItem = {
  key: string;
  count: number;
  rank: number;
  label: string;
};

export default function WordCount() {
  const { filters, setFilters } = useParameters();
  const [loading, setLoading] = useState(true);
  const [wordCountArray, setWordCountArray] = useState<Array<WordCountItem>>(
    []
  );

  const columns = [
    { name: "Rank", key: "rank" },
    { name: "Word", key: "label" },
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
    <View height="100%">
      <Header>Frequency of words found in General Conference talks.</Header>
      <Flex justifyContent="space-between">
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
        <Filters onChange={setFilters} value={filters} />
      </Flex>
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
    </View>
  );
}

type ColumnKey = "label" | "count";
