import React from "react";
import { Heading, Link, View } from "@adobe/react-spectrum";

export default function Home() {
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
          welfare sessions, firesides, and session overviews.
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
          Welfare sessions, firesides, and other talks were manually found and
          had filter rules created for them. It is possible that additional
          talks should be removed, or that some were removed when they shouldn't
          have been, but I have manually verified to the best of my ability that
          this has not happened.
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
    </View>
  );
}
