import React from "react";
import renderer from "react-test-renderer";
import talks_1973_10 from "@root/case2/output/1973-10.json";

import getSnippetFromResults from "./getSnippetFromResults";

type Results = RegExpMatchArray[];

const Example = ({ results }: { results: Results }) =>
  getSnippetFromResults(results);

const text = talks_1973_10[0].content;

describe("creates a logical snippet for the results", () => {
  it("case 1", () => {
    const results: Results = Array.from(text.matchAll(/ment/gi));

    expect(
      renderer.create(<Example results={results} />).toJSON()
    ).toMatchSnapshot();
  });
});
