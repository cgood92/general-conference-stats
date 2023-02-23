import React, { useState } from "react";
import { ActionButton, Flex, SearchField } from "@adobe/react-spectrum";
import { Item, TagGroup } from "@react-spectrum/tag";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";

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
      <Flex gap="size-50">
        <SearchField
          aria-label="Search for a term"
          onChange={setCurrentSearchText}
          onClear={onClear}
          onSubmit={onSubmit}
          value={currentSearchText}
          flex={1}
        />
        <ActionButton
          aria-label="Ring for service"
          onPress={() => onSubmit(currentSearchText)}
        >
          <ChevronRight />
        </ActionButton>
      </Flex>
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
