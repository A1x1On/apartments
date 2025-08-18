export const formatCurrency = (sum: number, cur: string = "", minimumFractionDigits: number = 0) => {
  if (sum !== undefined && sum !== null) {
    const currency = cur ? ` ${cur}` : "";
    return (
      sum.toLocaleString("en-UK", {
        style: "decimal",
        minimumFractionDigits,
      }) + currency
    );
  } else {
    return sum;
  }
};
