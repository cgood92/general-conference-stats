import { getGrowthData, trailingAverage } from "./getGrowthData";

test("separates net increase, percentage growth and percentage-point change", () => {
  const result = getGrowthData([
    { year: "2000", value: 100 },
    { year: "2001", value: 110 },
    { year: "2002", value: 121 },
  ]);
  expect(result.additions).toEqual([null, 10, 11]);
  expect(result.rates).toEqual([null, 10, 10]);
  expect(result.changes).toEqual([null, null, 0]);
});
test("does not derive annual changes across missing years or zero denominators", () => {
  const result = getGrowthData([
    { year: "2000", value: 0 },
    { year: "2001", value: 10 },
    { year: "2003", value: 20 },
  ]);
  expect(result.rates).toEqual([null, null, null]);
  expect(result.additions).toEqual([null, 10, null]);
});
test("trailing smoothing requires a complete window and preserves zero values", () => {
  expect(trailingAverage([null, 0, 3, 6, null])).toEqual([
    null,
    null,
    null,
    3,
    null,
  ]);
});
