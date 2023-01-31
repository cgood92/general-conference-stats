import React from "react";
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { useAsyncList } from "react-stately";

import { SearchResult } from "./getTrendData";
import getSnippetFromResults from "./getSnippetFromResults";

type SearchResultsTableProps = {
  data: SearchResult[][];
};

export default function SearchResultsTable({ data }: SearchResultsTableProps) {
  const columns = [
    { name: "Talk", key: "talk", width: "25%" },
    { name: "Speaker", key: "speaker", width: "15%" },
    { name: "Year", key: "year", width: "5%" },
    { name: "Search results", key: "snippet" },
  ];

  const list = useAsyncList({
    async load({ cursor }) {
      const start = getUniqueCursor(cursor);

      const items = data
        .flat()
        .reverse()
        .slice(start, start + 20)
        .map((result) => ({
          talk: result.talk,
          snippet: getSnippetFromResults(result.results),
        }));

      const nextCursor = makeUniqueCursor(
        items.length ? start + 20 : undefined
      );

      return {
        items,
        cursor: nextCursor,
      };
    },
  });

  return (
    <TableView
      aria-label="Results list"
      marginTop="size-300"
      maxHeight="size-6000"
      overflowMode="wrap"
    >
      <TableHeader columns={columns}>
        {(column) => <Column width={column.width as any}>{column.name}</Column>}
      </TableHeader>
      <TableBody
        items={list.items}
        loadingState={list.loadingState}
        onLoadMore={list.loadMore}
      >
        {(item: any) => (
          <Row key={item.talk.url}>
            {(key) => {
              if (key === "talk") {
                return (
                  <Cell>
                    <a
                      href={item.talk.url}
                      rel="noreferrer"
                      target="_blank"
                      // For some reason, link clicks are getting swallowed in the table, so this onClick is necessary
                      onClick={() => window.open(item.talk.url, "_blank")}
                    >
                      {item.talk.title}
                    </a>
                  </Cell>
                );
              }
              if (key === "speaker") {
                return <Cell>{item.talk.speaker}</Cell>;
              }
              if (key === "year") {
                return <Cell>{item.talk.year}</Cell>;
              }
              return <Cell>{item.snippet}</Cell>;
            }}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
}

function getUniqueCursor(cursor: string | undefined) {
  if (cursor == null) {
    return 0;
  }

  return parseInt(cursor.substring(cursor.indexOf("-") + 1));
}

function makeUniqueCursor(num: number | undefined) {
  if (num === undefined) {
    return num;
  }

  return `${Math.random()}-${num}`;
}
