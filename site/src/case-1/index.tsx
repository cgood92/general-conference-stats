import React from "react";
import { View } from "@adobe/react-spectrum";
import ApexChart from "react-apexcharts";

import data from "@root/case1/output/stats.json";

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

export default function Main() {
  return (
    <View height="100%" paddingX="size-3000">
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

function getChartOptions({ title }: { title: string }) {
  return {
    chart: {
      height: 350,
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: title,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    markers: {
      size: 0.5,
    },
    xaxis: {
      categories: years,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Number(value).toLocaleString()
      }
    },
  }
};