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
      <Heading id="talk-content" level={3}>
        Talk content
      </Heading>
      <ol>
        <li>
          General conference addresses since 1971 are published online at{" "}
          <a href="https://churchofjesuschrist.org/study/general-conference">
            churchofjesuschrist.org/study/general-conference
          </a>
          . I scraped the contents of each talk, saving each conference in{" "}
          <a href="https://github.com/cgood92/general-conference-stats/tree/master/case2/output">
            JSON format.
          </a>
        </li>
        <li>
          I filter out talks that came from welfare sessions, firesides, audit
          reports and sustainings.
        </li>
        <li>I removed content in image and superscript tags.</li>
      </ol>
      <p>Limitations:</p>
      <ol>
        <li>
          Welfare sessions, firesides, audit reports and sustaining talks were
          manually found and had filter rules created to exclude them. It is
          possible that additional talks should be removed, or that some were
          removed when they shouldn't have been, but I have manually verified to
          the best of my ability that this has not happened (see{" "}
          <a href="https://github.com/cgood92/general-conference-stats/blob/master/case2/output/output.txt">
            output log here
          </a>
          ).
        </li>
        <li>
          Talks include special characters, such as non-plaintext quotation
          marks and hyphens. These are kept, and search results are affected by
          that.
        </li>
      </ol>
      <Heading id="growth-statistics" level={3}>
        Growth statistics
      </Heading>
      <ol>
        <li>
          For most years since 1971, growth statistical data was consistently
          reported in General Conference. I fetched the HTML for these years,
          found all the statistics that were reported in a table, then tried to
          programmatically label the statistics related to growth.
        </li>
        <li>
          The years 1971, 2010 were not consistent in their HTML table
          structure, so I hard-coded these statistics manually. Since 2017,
          growth statistics are not reported in General Conference, but I
          programmatically looked these up from church newsroom reports.
        </li>
      </ol>
      <p>Limitations:</p>
      <ol>
        <li>
          The labeling of the data was programmatic (such as number of wards and
          stakes), and has not yet been verified (though the graphs seem to look
          correct).
        </li>
      </ol>
      <Heading id="see-something-wrong" level={2}>
        See something wrong?
      </Heading>
      <p>
        Please let me know by creating an issue in{" "}
        <a href="https://github.com/cgood92/general-conference-stats/issues">
          GitHub
        </a>
        .
      </p>
      <Heading id="please-contribute" level={2}>
        Have an idea?
      </Heading>
      <p>
        Please contribute by cloning{" "}
        <a href="https://github.com/cgood92/general-conference-stats">
          this repository
        </a>
        , and sending a pull request.
      </p>
      <Heading level={2}>Dataset</Heading>
      There are {Number(data.length).toLocaleString()} talks scraped.
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
