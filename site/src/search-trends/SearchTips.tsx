import React from "react";
import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
} from "@adobe/react-spectrum";
import FilterIcon from "@spectrum-icons/workflow/Filter";
import "./SearchTips.css";

export default function SearchTips() {
  return (
    <Flex alignItems="center">
      <ContextualHelp
        containerPadding={0}
        variant="help"
        UNSAFE_className="searchTips"
      >
        <Heading>Search tips</Heading>
        <Content>
          <p>
            No stop-words are removed while searching. Search is exact (though
            not case-sensitive), including punctuation.
          </p>
          <p>
            Searching for "eve" will include "eventually", "even", "never", etc.
            If you want just the word "eve" by itself, include spaces around the
            term (ie " eve ").
          </p>
          <p>
            You can use the filter button <FilterIcon size="XS" /> to narrow
            results down by speaker or year.
          </p>
          <p>RegEx allows you to do special searches. For example:</p>
          <ul>
            <li>(brothers|brethren)</li>
            <li>great( and last)? day</li>
            <li>Ne.son</li>
            <li>Elder [a-zA-Z]+</li>
          </ul>
          <p>
            Learn more about RegEx{" "}
            <a href="https://regexone.com/" rel="noreferrer" target="_blank">
              here
            </a>
            .
          </p>
        </Content>
      </ContextualHelp>
      <Text>Search tips</Text>
    </Flex>
  );
}
