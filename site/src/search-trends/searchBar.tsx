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

  const onClear = () => setCurrentSearchText("");
  const onRemove = (term: React.Key) =>
    setSearchTerms((previous) =>
      previous.filter((savedTerm) => savedTerm !== term)
    );
  const onSubmit = (term: string) => {
    setSearchTerms((previous) => previous.concat(term));
    setCurrentSearchText("");
  };

  return (
    <>
      <SearchField
        aria-label="Search for a term"
        contextualHelp={<RegexHelp />}
        label={<span />} // This is something non-null to render contextual help
        onChange={setCurrentSearchText}
        onClear={onClear}
        onSubmit={onSubmit}
        value={currentSearchText}
        width={{ base: "100%", L: "size-6000" }}
      />
      <TagGroup
        aria-label="Search terms"
        allowsRemoving
        items={searchTerms.map((term) => ({ key: term, term }))}
        onRemove={onRemove}
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
      <ContextualHelp containerPadding={0} variant="info">
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
      regex supported
    </div>
  );
}
