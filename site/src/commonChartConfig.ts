const config = {
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
  yaxis: {
    labels: {
      formatter: (value: number) => Number(value).toLocaleString(),
    },
  },
};

export default config;
