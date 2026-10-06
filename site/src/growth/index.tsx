import React, { useState } from "react";
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import data from "@root/case1/output/stats.json";
import commonChartConfig from "../commonChartConfig";
import { getGrowthData, trailingAverage } from "./getGrowthData";
import "./index.css";

const metrics = [
  { key: "membership", label: "Membership" },
  { key: "stakes", label: "Stakes" },
  { key: "wards", label: "Wards / congregations" },
  { key: "converts", label: "Convert baptisms" },
  { key: "children_of_record", label: "Children of record" },
] as const;
export default function Growth() {
  const [metric, setMetric] = useState<string>("membership"),
    [smooth, setSmooth] = useState(false);
  const points = data.map((row) => ({
    year: row.year,
    value: (row as any)[metric] as number | null,
  }));
  const { additions, rates, changes } = getGrowthData(points);
  const label = metrics.find((m) => m.key === metric)!.label;
  const last = points.length - 1;
  const annualCount = metric === "converts" || metric === "children_of_record";
  const subject = metric === "membership" ? "members" : label.toLowerCase();
  const latestRate = rates[last];
  const latestChange = changes[last];
  const perHundred =
    latestRate == null
      ? ""
      : Math.abs(latestRate).toLocaleString(undefined, {
          maximumFractionDigits: Math.abs(latestRate) >= 1 ? 0 : 1,
        });
  const annualGrowthHelp =
    latestRate == null
      ? "We don’t have enough information to compare this year with last year."
      : latestRate === 0
      ? `There were just as many ${subject} as last year.`
      : `For every 100 ${subject} last year, there were about ${perHundred} ${
          latestRate > 0 ? "more" : "fewer"
        } this year.`;
  const paceHelp =
    latestChange == null || latestRate == null
      ? "We don’t yet know whether growth is getting faster or slower."
      : latestChange === 0
      ? "Things grew or shrank at the same speed as last year."
      : latestRate > 0
      ? `${metric === "membership" ? "The Church" : "The number"} grew ${
          latestChange > 0 ? "faster" : "more slowly"
        } this year than last year.`
      : latestRate < 0
      ? `There were fewer ${subject} this year. Things were ${
          latestChange > 0
            ? "moving toward growth"
            : "moving further away from growth"
        } compared with last year.`
      : `There were just as many ${subject} as last year, after ${
          latestChange > 0 ? "a drop" : "an increase"
        } the year before.`;
  const configs = [
    {
      title:
        metric === "converts" || metric === "children_of_record"
          ? "Reported annual count"
          : "Total " + label.toLowerCase(),
      subtitle: `See how many ${subject} were reported each year. (${
        annualCount ? "Reported annual count" : "Reported year-end total"
      } for the selected measure.)`,
      values: points.map((p) => p.value),
      unit: "",
      type: "line",
    },
    {
      title:
        metric === "converts" || metric === "children_of_record"
          ? "Change in annual count"
          : "Annual net increase",
      subtitle: `See whether there were more or fewer ${subject} than the year before. (This year’s ${
        annualCount ? "count" : "total"
      } minus last year’s; below zero means a decrease.)`,
      values: additions,
      unit: "",
      type: "bar",
    },
    {
      title: "Annual percentage growth",
      subtitle: annualCount
        ? "See how much this year’s count grew or shrank compared with last year’s. (Annual change divided by the previous year’s count, expressed as a percentage.)"
        : "See how quickly the total grew compared with how big it already was. (Annual net increase divided by the previous year’s total, expressed as a percentage.)",
      values: rates,
      unit: "%",
      type: "line",
    },
    {
      title: "Change in growth rate",
      subtitle:
        "See whether growth is speeding up or slowing down. (This year’s percentage growth minus last year’s, in percentage points; above zero means faster growth and below zero means slower growth.)",
      values: changes,
      unit: " pp",
      type: "bar",
    },
  ];
  return (
    <main className="growth-page">
      <div className="insight-eyebrow">THE BIG PICTURE</div>
      <h1>How is growth changing?</h1>
      <p className="growth-intro">
        A rising total is only part of the story. Explore how much changes each
        year, how quickly it changes, and whether that pace is accelerating.
      </p>
      <div className="growth-controls">
        <label>
          Measure{" "}
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            {metrics.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="growth-check">
          <input
            type="checkbox"
            checked={smooth}
            onChange={(e) => setSmooth(e.target.checked)}
          />{" "}
          Show trailing 3-year average
        </label>
      </div>
      <div className="growth-summary">
        <div>
          <span>Latest reported year</span>
          <strong>{points[last].year}</strong>
        </div>
        <div>
          <span>{label}</span>
          <strong>{points[last].value?.toLocaleString()}</strong>
        </div>
        <div>
          <span>Annual growth</span>
          <strong>{rates[last]?.toFixed(2)}%</strong>
          <p className="growth-summary-help">{annualGrowthHelp}</p>
        </div>
        <div>
          <span>Change in pace</span>
          <strong>
            {changes[last]! > 0 ? "+" : ""}
            {changes[last]?.toFixed(2)} pp
          </strong>
          <p className="growth-summary-help">{paceHelp}</p>
          <p className="growth-summary-help">
            Plus means growth sped up. Minus means it slowed down.
          </p>
        </div>
      </div>
      <div className="growth-grid">
        {configs.map((config) => {
          const formatter = (value: number) =>
            config.unit
              ? `${value.toFixed(2)}${config.unit}`
              : Math.round(value).toLocaleString();
          const options: ApexOptions = {
            ...commonChartConfig,
            chart: {
              ...commonChartConfig.chart,
              dropShadow: { enabled: false },
              animations: { enabled: false },
            },
            colors: ["#4966bc", "#c8893a"],
            stroke: { width: [3, 2], curve: "straight" },
            dataLabels: { enabled: false },
            xaxis: { categories: points.map((p) => p.year), tickAmount: 8 },
            yaxis: { labels: { formatter } },
            tooltip: { y: { formatter } },
            annotations:
              config.title.includes("Change") ||
              config.title.includes("increase")
                ? { yaxis: [{ y: 0, borderColor: "#77808d" }] }
                : {},
            plotOptions: {
              bar: {
                colors: {
                  ranges: [
                    { from: -1e12, to: 0, color: "#b46050" },
                    { from: 0, to: 1e12, color: "#4966bc" },
                  ],
                },
              },
            },
          };
          const series = [
            { name: config.title, data: config.values },
            ...(smooth
              ? [
                  {
                    name: "Trailing 3-year average",
                    data: trailingAverage(config.values),
                  },
                ]
              : []),
          ];
          return (
            <section className="growth-chart" key={config.title}>
              <h2>{config.title}</h2>
              <p>{config.subtitle}</p>
              <ApexChart
                options={options}
                series={series}
                type={smooth ? "line" : (config.type as "line" | "bar")}
                height={310}
              />
            </section>
          );
        })}
      </div>
      <details className="growth-method">
        <summary>How to read these charts</summary>
        <p>
          Annual differences approximate a first derivative. Changes in annual
          net increase approximate a second derivative. Percentage-point changes
          measure changes in relative growth. Missing years and unavailable
          denominators appear as gaps; the three-year average requires three
          consecutive observations.
        </p>
        <p>
          Baptisms and children of record are annual reported flows, so their
          change charts describe changes in those annual counts. “Children of
          record” is retained as the source category; it is not labeled as
          baptisms.
        </p>
        <p>
          Data runs from {points[0].year} through {points[last].year}. These are
          reported membership statistics, not measures of attendance or
          activity. Reporting definitions may change over time.{" "}
          <a href={(data[last] as any).url} target="_blank" rel="noreferrer">
            Latest statistical report ↗
          </a>
        </p>
      </details>
    </main>
  );
}
