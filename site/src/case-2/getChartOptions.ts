type options = {
  searchTerms: Array<string>;
  yearsArray: Array<number>;
};

export default function getChartOptions({ searchTerms, yearsArray }: options) {
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
      enabled: true,
    },
    title: {
      text: `Use of ${searchTerms
        .map((term) => `"${term}"`)
        .join(", ")} over time`,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: yearsArray,
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
  };
}
