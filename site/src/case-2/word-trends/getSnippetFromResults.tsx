import React from "react";

export default function getSnippetFromResults(results: RegExpMatchArray[]) {
  return (
    <>
      ...
      {results.map((result) => {
        const { 0: textMatch, index, input } = result;

        const start = index!;
        const end = start + textMatch.length;

        const before = getBefore(input!, start);
        const mark = <mark>{textMatch}</mark>;
        const after = getAfter(input!, end);

        return (
          <React.Fragment key={index}>
            {before}
            {mark}
            {after}
          </React.Fragment>
        );
      })}
    </>
  );
}

function getBefore(input: string, index: number) {
  let cursor = 0;
  let currentCharacter = input[index - cursor];

  while (!isStopper(currentCharacter) && cursor < 80) {
    currentCharacter = input[index - ++cursor];
  }

  while (!isStopper(currentCharacter) && currentCharacter !== " ") {
    currentCharacter = input[index - --cursor];
  }

  return input.substring(index - cursor, index);
}

function getAfter(input: string, index: number) {
  let cursor = 0;
  let currentCharacter = input[index + cursor];

  while (!isStopper(currentCharacter) && cursor < 80) {
    currentCharacter = input[index + ++cursor];
  }

  while (!isStopper(currentCharacter) && currentCharacter !== " ") {
    currentCharacter = input[index + --cursor];
  }

  return input.substring(index, index + cursor) + "...";
}

const stoppers = [undefined, "\n", ".", ";"];

function isStopper(character: string) {
  return stoppers.includes(character);
}
