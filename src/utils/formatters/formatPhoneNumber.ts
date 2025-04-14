export const formatTelefone = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1 $2 $3").trim();
  } else {
    return cleaned
      .replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, "$1 $2 $3 $4")
      .trim();
  }
};
