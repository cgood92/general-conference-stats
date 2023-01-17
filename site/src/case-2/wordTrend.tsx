import React, { useEffect, useMemo, useState } from "react";
import ApexChart from "react-apexcharts";
import { Link } from "@adobe/react-spectrum";
import { Link as RouterLink } from "react-router-dom";
import { FilterState, minYear } from "./filters";
import data from "./data";
import "./wordCount.css";
import getChartOptions from "./getChartOptions";
import Crunching from "./crunching";
import EmptySearch from "./emptySearch";

type WordTrendProps = {
  filters: FilterState;
  searchTerms: Array<string>;
};

type Series = { name: string; data: Array<number> };

export default function WordTrend({ filters, searchTerms }: WordTrendProps) {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Array<Series>>([]);

  const yearsArray = useMemo(
    () =>
      new Array(filters.years.end - filters.years.start)
        .fill(null)
        .map((_, index) => minYear + index),
    [filters.years.end, filters.years.start]
  );

  useEffect(() => {
    if (searchTerms.length === 0) {
      setLoading(false);
      return;
    }

    new Promise((resolve) => setTimeout(resolve))
      .then(() =>
        data.filter((talk) => {
          let validSpeaker = true;

          if (filters.speaker) {
            validSpeaker = talk.speaker === filters.speaker;
          }

          const validYear =
            talk.year <= filters.years.end && talk.year >= filters.years.start;

          return validSpeaker && validYear;
        })
      )
      .then((rows) => rows.filter((talk) => talk.content))
      .then((talks) =>
        searchTerms.map((searchTerm) =>
          talks
            .map((talk) => ({
              talk,
              results: Array.from(
                talk.content!.matchAll(new RegExp(searchTerm, "ig"))
              ),
            }))
            .filter(({ results }) => results.length)
        )
      )
      .then((results) =>
        searchTerms.map((_, index) => {
          const groupByYear = results[index].reduce(
            (acc: Record<string, number>, resultSet) => {
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
        })
      )
      .then((arraysByYear) =>
        searchTerms.map((searchTerm, index) => ({
          name: searchTerm,
          data: arraysByYear[index].map(({ count }) => count),
        }))
      )
      .then((series) => {
        setSeries(series);
        setLoading(false);
      });
  }, [
    filters.speaker,
    filters.years.end,
    filters.years.start,
    searchTerms,
    yearsArray,
  ]);

  const goBack = (
    <Link>
      <RouterLink to="/case-2">← Leave search</RouterLink>
    </Link>
  );

  if (loading) {
    return <Crunching />;
  }

  if (searchTerms.length === 0) {
    return (
      <>
        <EmptySearch />
        {goBack}
      </>
    );
  }

  const options = getChartOptions({ searchTerms, yearsArray });

  return (
    <>
      <ApexChart options={options} series={series} type="line" height={350} />
      {goBack}
    </>
  );
}
