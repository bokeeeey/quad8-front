export const formatNumber = (value: string | number) => {
  const targerValue = value.toString();
  return targerValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
