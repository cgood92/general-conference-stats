import React, { useState } from "react";
import {
  Content,
  ContextualHelp,
  Heading,
  SearchField,
  Well,
} from "@adobe/react-spectrum";
import { Item, TagGroup } from "@react-spectrum/tag";

type SearchBarProps = {
  searchTerms: string[];
  setSearchTerms: (callback: (previous: string[]) => string[]) => void;
};

export default function SearchBar({
  searchTerms,
  setSearchTerms,
}: SearchBarProps) {
  const [currentSearchText, setCurrentSearchText] = useState("");

  return (
    <>
      <SearchField
        contextualHelp={<RegexHelp />}
        value={currentSearchText}
        onChange={setCurrentSearchText}
        aria-label="Search for a term"
        label={<span />}
        onClear={() => {
          setCurrentSearchText("");
        }}
        onSubmit={(term) => {
          setSearchTerms((previous) => previous.concat(term));
          setCurrentSearchText("");
        }}
        width={{ base: "100%", L: "size-6000" }}
      />
      <TagGroup
        items={searchTerms.map((term) => ({ key: term, term }))}
        allowsRemoving
        onRemove={(term) =>
          setSearchTerms((previous) =>
            previous.filter((savedTerm) => savedTerm !== term)
          )
        }
        aria-label="Search terms"
      >
        {(item) => <Item>{item.term}</Item>}
      </TagGroup>
    </>
  );
}

function RegexHelp() {
  return (
    <div>
      Search for a term, and press "Enter" -
      <ContextualHelp variant="info" containerPadding={0}>
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
            <a href="https://regexone.com/" target="_blank" rel="noreferrer">
              here
            </a>
            .
          </p>
        </Content>
      </ContextualHelp>
      regex supported
    </div>
  );
}
