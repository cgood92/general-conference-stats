import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import { Navigate, Routes, Route } from "react-router-dom";
import Filters from "./filters";
import SearchBar from "./searchBar";
import useParameters from "./word-trends/useParameters";
import WordCount from "./word-counts";
import WordTrend from "./word-trends";

export default function Case1() {
  const { filters, setFilters, searchTerms, setSearchTerms } = useParameters();

  return (
    <Flex height="100%" direction="column">
      <SearchBar searchTerms={searchTerms} setSearchTerms={setSearchTerms} />
      <Flex direction={{ base: "column-reverse", L: "row" }}>
        <View height="100%" width={{ base: "100%", L: "85%" }}>
          <Routes>
            <Route
              path="search"
              element={
                <WordTrend filters={filters} searchTerms={searchTerms} />
              }
            ></Route>
            <Route
              path=""
              element={
                searchTerms.length ? (
                  <Navigate
                    to={{
                      pathname: "search",
                      search: window.location.hash.substr(
                        window.location.hash.indexOf("?")
                      ),
                    }}
                    replace={true}
                  />
                ) : (
                  <WordCount filters={filters} />
                )
              }
            ></Route>
          </Routes>
        </View>
        <Filters onChange={setFilters} value={filters} />
      </Flex>
    </Flex>
  );
}
