export const formatCEP = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
};
