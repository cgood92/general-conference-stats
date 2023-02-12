import React from "react";
import {
  Cell,
  Column,
  Heading,
  Link,
  Row,
  TableView,
  TableBody,
  TableHeader,
  View,
} from "@adobe/react-spectrum";
import data from "../shared/data";

export default function Methodology() {
  const columns = [
    { name: "Talk", key: "talk", width: "25%" },
    { name: "Speaker", key: "speaker", width: "15%" },
    { name: "Date", key: "date", width: "10%" },
    { name: "Length", key: "length" },
  ];

  return (
    <View height="100%">
      View the source code on{" "}
      <Link>
        <a href="https://github.com/cgood92/general-conference-stats">GitHub</a>
      </Link>
      .
      <Heading id="how-was-the-data-acquired" level={2}>
        How was the data acquired?
      </Heading>
      <p>
        You can inspect the code yourself, but here&#39;s a high-level overview:
      </p>
      <Heading id="case-1" level={3}>
        Case 1
      </Heading>
      <ol>
        <li>
          For most years, these statistics data was consistently reported in
          General Conference. I fetched the HTML for these years, found all the
          statistics that were reported in a table, then tried to
          programmatically label the statistics related to growth.
        </li>
        <li>
          The years 1971, 2010 were not consistent in their HTML table
          structure, so I looked these statistics up manually. Since 2017, these
          statistics are not reported in General Conference, but I
          programmatically looked these up from church newsroom reports.
        </li>
      </ol>
      <p>Limitations:</p>
      <ol>
        <li>
          The labeling of the data was programmatic, and has not yet been
          verified (though the graphs seem to look as though they were correct).
        </li>
      </ol>
      <Heading id="case-2" level={3}>
        Case 2
      </Heading>
      <ol>
        <li>
          Each conference has a table of contents page. I went through the table
          of contents, found all the links for each talk, filtered out talks in
          welfare sessions, firesides, audit reports, sustainings and session
          overviews.
        </li>
        <li>
          With a list of talks per conference, I fetched the HTML for each talk.
        </li>
        <li>
          I programmatically looked for the main text of the talk, scraped the
          text, and removed image and superscript tags.
        </li>
      </ol>
      <p>Limitations:</p>
      <ol>
        <li>
          Welfare sessions, firesides, audit reports, sustainings and other
          talks were manually found and had filter rules created to exclude
          them. It is possible that additional talks should be removed, or that
          some were removed when they shouldn't have been, but I have manually
          verified to the best of my ability that this has not happened (see{" "}
          <a href="https://github.com/cgood92/general-conference-stats/blob/master/case2/output/output.txt">
            output log here
          </a>
          ).
        </li>
      </ol>
      <Heading id="can-you-help" level={2}>
        See something wrong?
      </Heading>
      <p>
        Please let me know by creating an issue in{" "}
        <a href="https://github.com/cgood92/general-conference-stats">GitHub</a>
        .
      </p>
      <Heading level={2}>Dataset</Heading>
      <TableView aria-label="List of talks" marginTop="size-300">
        <TableHeader columns={columns}>
          {(column) => (
            <Column width={column.width as any}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={data}>
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
                return (
                  <Cell>
                    {Number(item.content?.length || 0).toLocaleString()}
                  </Cell>
                );
              }}
            </Row>
          )}
        </TableBody>
      </TableView>
    </View>
  );
}
