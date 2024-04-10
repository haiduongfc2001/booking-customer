interface FormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export default function formatCurrency(
  number: number,
  options?: FormatOptions
): string {
  const defaultOptions: FormatOptions = {
    locale: "en-US",
    currency: "VND",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat(defaultOptions.locale, {
    style: defaultOptions.currency ? "currency" : "decimal",
    currency: defaultOptions.currency,
    minimumFractionDigits: defaultOptions.minimumFractionDigits,
    maximumFractionDigits: defaultOptions.maximumFractionDigits,
  }).format(number);
}
