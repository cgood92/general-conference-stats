import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { FilterState, maxYear, minYear } from "./filters";

const defaultSearchParams = {
  speaker: "",
  start: String(minYear),
  end: String(maxYear),
  searchTerms: [],
};

export default function useParameters() {
  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams);

  const speaker = searchParams.get("speaker") || "";
  const start = parseInt(searchParams.get("start")!);
  const end = parseInt(searchParams.get("end")!);
  const currentSearchText = searchParams.get("search") || "";
  const searchTerms = searchParams.getAll("searchTerms");

  const filters = useMemo(
    () => ({
      speaker,
      years: {
        start,
        end,
      },
    }),
    [end, speaker, start]
  );

  const setFilters = useCallback(
    (filters: FilterState) =>
      setSearchParams(
        (previous) => (
          previous.set("speaker", filters.speaker),
          previous.set("start", String(filters.years.start)),
          previous.set("end", String(filters.years.end)),
          previous
        )
      ),
    [setSearchParams]
  );

  const setCurrentSearchText = useCallback(
    (search: string) =>
      setSearchParams((previous) => (previous.set("search", search), previous)),
    [setSearchParams]
  );

  const setSearchTerms = useCallback(
    (callback: (previous: Array<string>) => Array<string>) =>
      setSearchParams((urlSearchParams) => {
        const previous = urlSearchParams.getAll("searchTerms");
        const next = callback(previous);

        urlSearchParams.delete("searchTerms");

        next.forEach((term) => urlSearchParams.append("searchTerms", term));

        return urlSearchParams;
      }),
    [setSearchParams]
  );

  return {
    filters,
    setFilters,
    currentSearchText,
    setCurrentSearchText,
    searchTerms,
    setSearchTerms,
  };
}
