import data from "../data";
import { filterData, FilterState } from "../filters";

type SearchTerms = Array<string>;

export function getSearchResults(
  filters: FilterState,
  searchTerms: SearchTerms
) {
  return Promise.resolve(data)
    .then((data) => filterData(data, filters))
    .then((talks) => searchForTerms(talks, searchTerms));
}

export function getTrendData(
  searchResults: Array<Array<SearchResult>>,
  searchTerms: SearchTerms,
  yearsArray: Array<number>
) {
  return Promise.resolve(searchResults)
    .then((results) => groupIntoYears(results, searchTerms, yearsArray))
    .then((arraysByYear) => shapeIntoSeries(arraysByYear, searchTerms));
}

export type SearchResult = {
  talk: (typeof data)[3];
  results: Array<RegExpMatchArray>;
};

function searchForTerms(
  talks: ReturnType<typeof filterData>,
  terms: SearchTerms
): Array<Array<SearchResult>> {
  return terms.map((searchTerm) =>
    talks
      .map((talk) => ({
        talk,
        results: Array.from(
          talk.content!.matchAll(new RegExp(searchTerm, "ig"))
        ),
      }))
      .filter(({ results }) => results.length)
  );
}

function groupIntoYears(
  results: ReturnType<typeof searchForTerms>,
  terms: SearchTerms,
  yearsArray: Array<number>
) {
  return terms.map((_, index) => {
    const groupByYear = results[index].reduce<Record<string, number>>(
      (acc, resultSet) => {
        const previous = acc[resultSet.talk.year] || 0;
        acc[resultSet.talk.year] = previous + resultSet.results.length;

        return acc;
      },
      {}
    );

    return yearsArray.map((year) => ({
      key: year,
      year,
      count: groupByYear[year] || 0,
    }));
  });
}

function shapeIntoSeries(
  arraysByYear: ReturnType<typeof groupIntoYears>,
  terms: SearchTerms
) {
  return terms.map((term, index) => ({
    name: term,
    data: arraysByYear[index].map(({ count }) => count),
  }));
}
