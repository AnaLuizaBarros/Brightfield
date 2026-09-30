const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatUsd = (value: number) => usdWhole.format(value);
export const formatUsdCents = (value: number) => usdCents.format(value);
export const formatInt = (value: number) => integer.format(value);
export const formatYears = (value: number) => value.toFixed(1);
export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;

export const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
