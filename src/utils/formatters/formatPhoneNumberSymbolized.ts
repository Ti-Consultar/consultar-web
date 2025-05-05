export const formatPhoneNumberSymbolized = (value: string) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const primeiro = digits.slice(2, 3);
    const meio = digits.slice(3, 7);
    const fim = digits.slice(7, 11);

    return `(${ddd}) ${primeiro} ${meio}-${fim}`;
  } else if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    const meio = digits.slice(2, 6);
    const fim = digits.slice(6, 10);

    return `(${ddd}) ${meio}-${fim}`;
  }

  return value; 
};
