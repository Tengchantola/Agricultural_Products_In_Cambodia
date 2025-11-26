export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
