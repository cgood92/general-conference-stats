import React from "react";
import { Heading, Link, View } from "@adobe/react-spectrum";
import { Link as ReactLink } from "react-router-dom";

export default function Home() {
  return (
    <View height="100%">
      View the code on{" "}
      <Link>
        <a href="https://github.com/cgood92/general-conference-stats">
          GitHub here
        </a>
      </Link>
      .
      <Heading id="what-is-this-project-about-" level={2}>
        What is this project about?
      </Heading>
      <p>
        As both a analytical person as well as a programmer, I had this itch to
        look at a few things from General Conference:
      </p>
      <ol>
        <li>
          <Link>
            <ReactLink to="/case-1">Case 1</ReactLink>
          </Link>
          : What does the growth of the church look like?
        </li>
        <li>
          <Link>
            <ReactLink to="/case-1">Case 2</ReactLink>
          </Link>
          : What trends of phrases have happened in the church vocabulary?
        </li>
      </ol>
      <p>
        For the record, I&#39;m a very happy member of the Church of Jesus
        Christ of Latter-day Saints, so my motives are nothing but positive in
        analyzing these things.
      </p>
      <Heading id="how-was-the-data-acquired" level={2}>
        How was the data acquired
      </Heading>
      <p>
        You can inspect the code yourself, but here&#39;s a high-level overview:
      </p>
      <Heading id="case-1" level={3}>
        Case 1
      </Heading>
      <ol>
        <li>
          For most years, the data was consistently reported in General
          Conference, with a table structure that was consistent. I fetched the
          HTML from these years, found all the statistics that were reported,
          then tried to programmatically label the statistics related to growth.
        </li>
        <li>
          The years 1971, 2010 were not consistent, so I looked these statistics
          up manually. 2017 - 2021 were not reported in General Conference
          anymore, but I programmatically looked these up as well.
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
          of contents, and found all the links for each session. I filtered out
          links that included the word &quot;Session&quot; in them, as those
          links went to pages without text.
        </li>
        <li>
          With a list of links per conference, I fetched the HTML for each link.
        </li>
        <li>
          I programmatically looked for the main text of the talk, and scraped
          the text. I did remove all text inside of link tags and image tags.
          Removing the link tags was a quick way to filter out footnote links,
          but results in a current limitation below.
        </li>
      </ol>
      <p>Limitations:</p>
      <ol>
        <li>
          Retrieving and cleaning the talk content itself is something I need to
          improve. Currently, all text inside of links are removed, which works
          to remove footnote links but removes some scripture references and
          other things.
        </li>
        <li>
          I have not yet verified that the talks that were downloaded are all
          legit. I have also not yet verified that this works for Priesthood
          Sessions and Women Sessions.
        </li>
      </ol>
      <Heading id="what-is-next" level={2}>
        What&#39;s next:
      </Heading>
      <ol>
        <li>Validate the dataset</li>
        <li>Make improvements to the website</li>
        <li>Write unit tests</li>
        <li>Explore more ideas</li>
      </ol>
      <Heading id="can-you-help" level={2}>
        Can you help?
      </Heading>
      <p>Please contribute to this project if you:</p>
      <ol>
        <li>Have a good idea</li>
        <li>See something that needs correction</li>
      </ol>
    </View>
  );
}
