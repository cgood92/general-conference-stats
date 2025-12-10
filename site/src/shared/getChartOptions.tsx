import commonChartConfig from "../commonChartConfig";
import { numberToConferenceName } from "./filters";

type options = {
  searchTerms: Array<string>;
  yearsArray: Array<number>;
};

export function getChartOptions({ searchTerms, yearsArray }: options) {
  return {
    ...commonChartConfig,
    dataLabels: {
      enabled: true,
    },
    title: {
      text: `Use of ${searchTerms
        .map((term) => `"${term}"`)
        .join(", ")} over time`,
    },
    xaxis: {
      categories: yearsArray.map(numberToConferenceName),
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
  };
}
