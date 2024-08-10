export const convertCategory = (category: string | undefined) => {
  if (category === 'keyboard' || category === 'keycap' || category === 'switch' || category === undefined) {
    return category;
  }
  return 'etc';
};
