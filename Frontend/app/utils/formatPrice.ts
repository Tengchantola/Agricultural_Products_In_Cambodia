export const formatPrice = (price: string) => {
  return (
    new Intl.NumberFormat("km-KH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price)) + " ៛"
  );
};
