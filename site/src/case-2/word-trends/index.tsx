import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@adobe/react-spectrum";
import ApexChart from "react-apexcharts";
import { Link as RouterLink } from "react-router-dom";
import Crunching from "../crunching";
import EmptySearch from "./emptySearch";
import { FilterState, minYear } from "../filters";
import { getChartOptions } from "../getChartOptions";
import { getTrendData } from "./getTrendData";

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

    getTrendData(filters, searchTerms, yearsArray).then((series) => {
      setSeries(series);
      setLoading(false);
    });
  }, [filters, searchTerms, yearsArray]);

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

const goBack = (
  <Link>
    <RouterLink to="/case-2">← Leave search</RouterLink>
  </Link>
);
