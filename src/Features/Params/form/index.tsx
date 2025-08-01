import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface Parameter {
  id: number;
  name: string;
  parameterYear: number;
  parameterValue: number;
}

interface ModalFormParameterProps {
  open: boolean;
  onClose: () => void;
  onSave: (param: Omit<Parameter, "id"> | Parameter) => void;
  parameter?: Parameter; // undefined => modo criação
}

export const ModalFormParameter = ({
  open,
  onClose,
  onSave,
  parameter,
}: ModalFormParameterProps) => {
  const [name, setName] = useState("");
  const [parameterYear, setParameterYear] = useState<Dayjs | null>(null);
  const [parameterValue, setParameterValue] = useState<string>("");

  useEffect(() => {
    if (parameter) {
      setName(parameter.name);
      setParameterYear(dayjs().year(parameter.parameterYear)); // cria um Dayjs com ano correto
      setParameterValue(parameter.parameterValue.toString());
    } else {
      setName("");
      setParameterYear(null);
      setParameterValue("");
    }
  }, [parameter, open]);

  const handleSubmit = () => {
    if (!name || !parameterYear || !parameterValue) return;

    const newParam = {
      ...parameter, // mantém o id se for edição
      name,
      parameterYear: parameterYear.year(), // pega o número do ano do Dayjs
      parameterValue: Number(parameterValue),
    };

    onSave(newParam);
    onClose();
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setParameterValue(value.replace(",", ".")); // transforma vírgula em ponto
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {parameter ? "Editar Parâmetro" : "Novo Parâmetro"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome do Parâmetro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Ano"
                value={parameterYear}
                onChange={(newValue) => setParameterYear(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Valor (%)"
              value={parameterValue}
              onChange={handleValueChange}
              inputProps={{ inputMode: "decimal" }}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "var(--neutral-700)" }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
