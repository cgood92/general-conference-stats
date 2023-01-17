import React from "react";
import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";

export default function EmptySearch() {
  return (
    <IllustratedMessage height="auto" marginY="size-1000">
      <NoSearchResults />
      <Heading>No terms to search for</Heading>
      <Content>Go ahead, search something else, it'll be fun!</Content>
    </IllustratedMessage>
  );
}
