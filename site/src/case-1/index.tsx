import React from "react";
import { View } from "@adobe/react-spectrum";
import ApexChart from "react-apexcharts";

import data from "@root/case1/output/stats.json";
import commonChartConfig from "../commonChartConfig";

export default function Case2() {
  return (
    <View height="100%">
      {[stakesSeries, wardsSeries, membershipSeries, baptismsSeries].map(
        (series, index) => (
          <ApexChart
            key={index}
            options={getChartOptions({ title: chartLabelMap.get(series)! })}
            series={series}
            type="line"
            height={350}
          />
        )
      )}
    </View>
  );
}

const years = data.map(({ year }) => year);

const stakesSeries = [
  {
    name: "Stakes",
    data: data.map(({ stakes }) => stakes),
  },
];

const wardsSeries = [
  {
    name: "Wards",
    data: data.map(({ wards }) => wards),
  },
];

const membershipSeries = [
  {
    name: "Total Membership",
    data: data.map(({ membership }) => membership),
  },
];

const baptismsSeries = [
  {
    name: "Convert baptisms",
    data: data.map(({ converts }) => converts),
  },
  {
    name: "Children of record baptisms",
    data: data.map(({ children_of_record }) => children_of_record),
  },
];

const chartLabelMap = new Map([
  [stakesSeries, "Stakes"],
  [wardsSeries, "Wards"],
  [membershipSeries, "Total Membership"],
  [baptismsSeries, "Baptisms"],
]);

function getChartOptions({ title }: { title: string }) {
  return {
    ...commonChartConfig,
    title: {
      text: title,
    },
    xaxis: {
      categories: years,
    },
  };
};