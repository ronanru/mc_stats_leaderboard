export const upperCaseFirstLetter = (str: string) =>
  str
    .split('_')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
