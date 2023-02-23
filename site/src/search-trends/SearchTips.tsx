import React from "react";
import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
  Well,
} from "@adobe/react-spectrum";

export default function SearchTips() {
  return (
    <Flex alignItems="center">
      <ContextualHelp containerPadding={0} variant="help">
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
          <p>RegEx allows you to do special searches. For example:</p>
          <Well>(brothers|brethren)</Well>
          <Well>great( and last)? day</Well>
          <Well>Ne.son</Well>
          <Well>Elder [a-zA-Z]+</Well>
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
