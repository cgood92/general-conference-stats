import React, { useEffect, useState } from "react";
import {
  Cell,
  Column,
  Content,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Text,
  View,
} from "@adobe/react-spectrum";
import Crunching from "../shared/crunching";
import getVocabularySize from "./getVocabularySize";

type VocabularySizeItem = {
  key: string;
  distinct: number;
  rank: number;
  speaker: string;
  total: number;
};

export default function WordCount() {
  const [loading, setLoading] = useState(true);
  const [vocabularySizeArray, setVocabularySizeArray] = useState<
    Array<VocabularySizeItem>
  >([]);

  const columns = [
    { name: "Rank", key: "rank" },
    { name: "Speaker", key: "speaker" },
    { name: "Vocabulary size", key: "distinct" },
    { name: "Total words spoken", key: "total" },
  ];

  useEffect(() => {
    setLoading(true);
    getVocabularySize().then((vocabularySizeArray) => {
      setVocabularySizeArray(vocabularySizeArray);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Crunching />;
  }

  return (
    <View height="100%">
      <Content marginBottom="size-300">
        <Text>The amount of distinct words spoken by each speaker.</Text>
      </Content>
      <TableView
        aria-label="Vocabulary size table"
        marginTop="size-100"
        density="compact"
      >
        <TableHeader columns={columns}>
          {(column) => <Column>{column.name}</Column>}
        </TableHeader>
        <TableBody items={vocabularySizeArray}>
          {(item) => (
            <Row>
              {(columnKey) => {
                if (["distinct", "total"].includes(columnKey as string)) {
                  return (
                    <Cell>
                      {Number(
                        item[columnKey as "total" | "distinct"]
                      ).toLocaleString()}
                    </Cell>
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

type ColumnKey = "speaker" | "total" | "distinct" | "rank";
