import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { defaultSearchParams, FilterState } from "./filters";

export default function useParameters() {
  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams);

  const speaker = searchParams.get("speaker")!;
  const start = parseFloat(searchParams.get("start")!);
  const end = parseFloat(searchParams.get("end")!);
  const searchTermsText = searchParams.getAll("searchTerms").join("__");
  const memoizedSearchTerms = useMemo(
    () => searchTermsText.split("__").filter(Boolean),
    [searchTermsText]
  );

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
      setSearchParams((urlSearchParams) => {
        urlSearchParams.set("speaker", filters.speaker);
        urlSearchParams.set("start", String(filters.years.start));
        urlSearchParams.set("end", String(filters.years.end));
        return urlSearchParams;
      }),
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

  useSearchTracking(memoizedSearchTerms, filters);

  return {
    filters,
    setFilters,
    searchTerms: memoizedSearchTerms,
    setSearchTerms,
  };
}

function useSearchTracking(
  memoizedSearchTerms: string[],
  filters: { speaker: string; years: { start: number; end: number } }
) {
  const location = useLocation();
  useEffect(() => {
    const searchIsActive =
      location.pathname === "/search-trends" && memoizedSearchTerms.length;
    const filterWordCountsActive =
      location.pathname === "/word-counts" && location.search;

    if (searchIsActive || filterWordCountsActive) {
      window.gtag("event", "search", {
        page_location: location.pathname + location.search,
        search_term: memoizedSearchTerms.join("/"),
        speaker: filters.speaker,
        yearStart: filters.years.start,
        yearEnd: filters.years.end,
      });
    }
  }, [
    filters.speaker,
    filters.years.end,
    filters.years.start,
    location.pathname,
    location.search,
    memoizedSearchTerms,
  ]);
}
