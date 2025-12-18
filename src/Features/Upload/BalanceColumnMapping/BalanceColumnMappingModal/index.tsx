import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

import { columnLetterToNumber, columnNumberToLetter } from "../../../../utils/formatters/columnLetterToNumber";
import { BalanceColumnMappingConfig } from "../../../../types/balanceColumnMappingConfig";

type Props = {
  open: boolean;
  loading?: boolean;
  initialData?: BalanceColumnMappingConfig;
  onClose: () => void;
  onSubmit: (payload: BalanceColumnMappingConfig) => void;
};

export const BalanceColumnMappingModal = ({
  open,
  loading,
  initialData,
  onClose,
  onSubmit,
}: Props) => {
  const [startRow, setStartRow] = useState(1);
  const [cols, setCols] = useState({
    costCenterCol: "A",
    nameCol: "B",
    initialValueCol: "C",
    debitCol: "D",
    creditCol: "E",
    finalValueCol: "F",
  });

  useEffect(() => {
    if (!initialData) return;

    setStartRow(initialData.startRow);
    setCols({
      costCenterCol: columnNumberToLetter(initialData.costCenterCol),
      nameCol: columnNumberToLetter(initialData.nameCol),
      initialValueCol: columnNumberToLetter(initialData.initialValueCol),
      debitCol: columnNumberToLetter(initialData.debitCol),
      creditCol: columnNumberToLetter(initialData.creditCol),
      finalValueCol: columnNumberToLetter(initialData.finalValueCol),
    });
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return;

    onSubmit({
      ...initialData,
      startRow,
      costCenterCol: columnLetterToNumber(cols.costCenterCol),
      nameCol: columnLetterToNumber(cols.nameCol),
      initialValueCol: columnLetterToNumber(cols.initialValueCol),
      debitCol: columnLetterToNumber(cols.debitCol),
      creditCol: columnLetterToNumber(cols.creditCol),
      finalValueCol: columnLetterToNumber(cols.finalValueCol),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Mapeamento do Balancete</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Linha inicial do balancete"
            type="number"
            value={startRow}
            onChange={(e) => setStartRow(Number(e.target.value))}
            size="small"
          />

          <TextField
            label="Conta"
            value={cols.costCenterCol}
            onChange={(e) =>
              setCols({ ...cols, costCenterCol: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Descrição"
            value={cols.nameCol}
            onChange={(e) =>
              setCols({ ...cols, nameCol: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Saldo Anterior"
            value={cols.initialValueCol}
            onChange={(e) =>
              setCols({ ...cols, initialValueCol: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Débito"
            value={cols.debitCol}
            onChange={(e) =>
              setCols({ ...cols, debitCol: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Crédito"
            value={cols.creditCol}
            onChange={(e) =>
              setCols({ ...cols, creditCol: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Saldo Final"
            value={cols.finalValueCol}
            onChange={(e) =>
              setCols({ ...cols, finalValueCol: e.target.value })
            }
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
