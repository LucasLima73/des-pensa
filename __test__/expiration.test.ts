// Importe a função a ser testada
export const convertFormattedToDate = (formattedDate: string) => {
  const parts = formattedDate.split("/");
  if (parts.length !== 3) {
    return null; // Formato inválido
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // Não subtrai 1 do mês
  const year = parseInt(parts[2], 10);

  // Formata a data como "YYYY-MM-DD"
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};

// Teste
describe("convertFormattedToDate function", () => {
  test("should convert a valid formatted date string to a valid Date object", () => {
    const formattedDate = "01/12/2024"; // formato válido DD/MM/YYYY
    const convertedDate = convertFormattedToDate(formattedDate);
    expect(convertedDate).toEqual("2024-12-01");
  });
});
