export function getGrowthData(
  points: { year: string; value: number | null }[]
) {
  const additions = points.map((point, i) => {
    const prior = points[i - 1];
    return prior &&
      Number(point.year) - Number(prior.year) === 1 &&
      point.value != null &&
      prior.value != null
      ? point.value - prior.value
      : null;
  });
  const rates = additions.map((change, i) =>
    change != null && points[i - 1]?.value! > 0
      ? (100 * change) / points[i - 1].value!
      : null
  );
  const changes = rates.map((rate, i) =>
    rate != null && rates[i - 1] != null ? rate - rates[i - 1]! : null
  );
  return { additions, rates, changes };
}
export function trailingAverage(values: (number | null)[], window = 3) {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1);
    return slice.length === window && slice.every((v) => v != null)
      ? slice.reduce<number>((sum, v) => sum + v!, 0) / window
      : null;
  });
}
