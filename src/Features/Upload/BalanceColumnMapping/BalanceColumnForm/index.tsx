import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { columnLetterToNumber } from "../../../../utils/formatters/columnLetterToNumber";

type BalanceColumnFormProps = {
  accountPlanId: number;
  onSubmit: (payload: any) => void;
};

export const BalanceColumnForm = ({
  accountPlanId,
  onSubmit,
}: BalanceColumnFormProps) => {
  const [startRow, setStartRow] = useState(1);
  const [form, setForm] = useState({
    costCenterCol: "A",
    nameCol: "B",
    initialValueCol: "C",
    debitCol: "D",
    creditCol: "E",
    finalValueCol: "F",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value.toUpperCase(),
      }));
    };

  const handleSubmit = () => {
    const payload = {
      accountPlanId,
      startRow,
      costCenterCol: columnLetterToNumber(form.costCenterCol),
      nameCol: columnLetterToNumber(form.nameCol),
      initialValueCol: columnLetterToNumber(form.initialValueCol),
      debitCol: columnLetterToNumber(form.debitCol),
      creditCol: columnLetterToNumber(form.creditCol),
      finalValueCol: columnLetterToNumber(form.finalValueCol),
    };

    onSubmit(payload);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography fontWeight={600}>Gerenciamento de Colunas</Typography>

      <TextField
        label="Planilha começa na linha:"
        type="number"
        value={startRow}
        onChange={(e) => setStartRow(Number(e.target.value))}
        size="small"
      />

      <TextField
        label="Conta"
        value={form.costCenterCol}
        onChange={handleChange("costCenterCol")}
        size="small"
      />

      <TextField
        label="Descrição"
        value={form.nameCol}
        onChange={handleChange("nameCol")}
        size="small"
      />

      <TextField
        label="Saldo Anterior"
        value={form.initialValueCol}
        onChange={handleChange("initialValueCol")}
        size="small"
      />

      <TextField
        label="Débito"
        value={form.debitCol}
        onChange={handleChange("debitCol")}
        size="small"
      />

      <TextField
        label="Crédito"
        value={form.creditCol}
        onChange={handleChange("creditCol")}
        size="small"
      />

      <TextField
        label="Saldo Final"
        value={form.finalValueCol}
        onChange={handleChange("finalValueCol")}
        size="small"
      />

      <Button variant="contained" onClick={handleSubmit}>
        Salvar
      </Button>
    </Box>
  );
};
