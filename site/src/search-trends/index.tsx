import React, { useEffect, useMemo, useState } from "react";
import { Flex, View } from "@adobe/react-spectrum";
import ApexChart from "react-apexcharts";
import Crunching from "../shared/crunching";
import EmptySearch from "./emptySearch";
import Filters from "../shared/filters";
import { getChartOptions } from "../shared/getChartOptions";
import { getSearchResults, getTrendData, SearchResult } from "./getTrendData";
import SearchBar from "./searchBar";
import SearchResultsTable from "./SearchResultsTable";
import useParameters from "../shared/useParameters";

type Series = { name: string; data: Array<number> };

export default function SearchTrends() {
  const { filters, setFilters, searchTerms, setSearchTerms } = useParameters();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Array<Series>>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[][]>([]);

  const yearsArray = useMemo(
    () =>
      new Array(filters.years.end - filters.years.start)
        .fill(null)
        .map((_, index) => filters.years.start + index),
    [filters.years.end, filters.years.start]
  );

  useEffect(() => {
    if (searchTerms.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

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

  return (
    <Flex height="100%" direction="column">
      <SearchBar searchTerms={searchTerms} setSearchTerms={setSearchTerms} />
      <Flex direction={{ base: "column-reverse", L: "row" }}>
        <View height="100%" width={{ base: "100%", L: "85%" }}>
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
        <Filters onChange={setFilters} value={filters} />
      </Flex>
    </Flex>
  );
}
