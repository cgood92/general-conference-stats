import React, { useEffect, useMemo, useRef, useState } from "react";
import { Flex, Provider, View, Well } from "@adobe/react-spectrum";
import ApexChart from "react-apexcharts";
import Crunching from "../shared/crunching";
import EmptySearch from "./emptySearch";
import Filters, { buildYearsArray } from "../shared/filters";
import { getChartOptions } from "../shared/getChartOptions";
import { getSearchResults, getTrendData, SearchResult } from "./getTrendData";
import SearchBar from "./searchBar";
import SearchResultsTable from "./SearchResultsTable";
import useParameters from "../shared/useParameters";
import SearchTips from "./SearchTips";

type Series = { name: string; data: Array<number> };

export default function SearchTrends() {
  const { filters, setFilters, searchTerms, setSearchTerms } = useParameters();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Array<Series>>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[][]>([]);
  const hasSearchedRef = useRef(false);

  const yearsArray = useMemo(
    () => buildYearsArray(filters.years.start, filters.years.end),
    [filters.years.end, filters.years.start]
  );

  useEffect(() => {
    if (searchTerms.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    hasSearchedRef.current = true;

    getSearchResults(filters, searchTerms).then((searchResults) => {
      setSearchResults(searchResults);
      getTrendData(searchResults, searchTerms, yearsArray).then((series) => {
        setSeries(series);
        setLoading(false);
      });
    });
  }, [filters, searchTerms, yearsArray]);

  if (loading) {
    return <Crunching />;
  }

  const options = getChartOptions({ searchTerms, yearsArray });
  const searchResultsKey = searchTerms.join("-") + searchResults.length;
  const hasSearched = hasSearchedRef.current;

  return (
    <>
      <Flex
        height={{ base: "auto", L: hasSearched ? "auto" : "100%" }}
        alignItems="center"
      >
        <Flex
          width={{ base: "100%", L: "size-6000" }}
          direction="column"
          margin={!hasSearched ? "auto" : undefined}
        >
          <Provider
            scale={hasSearched ? "medium" : "large"}
            UNSAFE_className="white"
          >
            <Flex justifyContent="space-between" marginBottom="size-50">
              <SearchTips />
              <Filters onChange={setFilters} value={filters} />
            </Flex>
            <SearchBar
              searchTerms={searchTerms}
              setSearchTerms={setSearchTerms}
            />
            {!hasSearched && (
              <Well>
                Try searching for words or phrases that were used in General
                Conference throughout the years, such as:
                <ul>
                  <li>covenant path</li>
                  <li>tithing</li>
                  <li>word of wisdom</li>
                </ul>
              </Well>
            )}
          </Provider>
        </Flex>
      </Flex>
      {hasSearched && (
        <View height="100%" width="100%">
          {searchTerms.length === 0 ? (
            <EmptySearch />
          ) : (
            <>
              <ApexChart
                options={options}
                series={series}
                type="line"
                height={350}
              />
              <SearchResultsTable key={searchResultsKey} data={searchResults} />
            </>
          )}
        </View>
      )}
    </>
  );
}
