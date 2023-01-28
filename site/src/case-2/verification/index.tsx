import React from "react";
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import data from "../data";

const items = data.sort(
  (a, b) => (a.content?.length || 0) - (b.content?.length || 0)
);

export default function Verification() {
  const columns = [
    { name: "Talk", key: "talk", width: "25%" },
    { name: "Speaker", key: "speaker", width: "15%" },
    { name: "Date", key: "date", width: "10%" },
    { name: "Length", key: "length" },
  ];

  return (
    <TableView aria-label="Results list" marginTop="size-300">
      <TableHeader columns={columns}>
        {(column) => <Column width={column.width as any}>{column.name}</Column>}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <Row key={item.url}>
            {(key) => {
              if (key === "talk") {
                return (
                  <Cell>
                    <a
                      href={item.url}
                      rel="noreferrer"
                      target="_blank"
                      // For some reason, link clicks are getting swallowed in the table, so this onClick is necessary
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      {item.title}
                    </a>
                  </Cell>
                );
              }
              if (key === "speaker") {
                return <Cell>{item.speaker}</Cell>;
              }
              if (key === "date") {
                return (
                  <Cell>
                    {item.month} / {item.year}
                  </Cell>
                );
              }
              return <Cell>{item.content?.length || 0}</Cell>;
            }}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
}
