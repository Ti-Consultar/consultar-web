export const columnLetterToNumber = (value: string) => {
  if (!value) return 0;

  return value
    .toUpperCase()
    .split("")
    .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);
};

export const columnNumberToLetter = (value: number) => {
  let result = "";
  let n = value;

  while (n > 0) {
    const mod = (n - 1) % 26;
    result = String.fromCharCode(65 + mod) + result;
    n = Math.floor((n - mod) / 26);
  }

  return result;
};
