import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { ArrowForward, ArrowBackRounded } from "@mui/icons-material";
import {
  FormContainer,
  MainContainer,
  StepCircle,
  StepperContainer,
} from "./styles";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { useLocation, useNavigate } from "react-router";

const months = [
  { label: "Janeiro", value: 1 },
  { label: "Fevereiro", value: 2 },
  { label: "Março", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Maio", value: 5 },
  { label: "Junho", value: 6 },
  { label: "Julho", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Setembro", value: 9 },
  { label: "Outubro", value: 10 },
  { label: "Novembro", value: 11 },
  { label: "Dezembro", value: 12 },
];

const steps = ["Selecionar Período", "Upload"];

interface BalanceSheetFormProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (event: SelectChangeEvent<number>) => void;
  onYearChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentStep: number;
  onBack: () => void;
}

export const BalanceSheetForm = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onSubmit,
  onUpload,
  onBack,
}: BalanceSheetFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStep = location.pathname.endsWith("/upload") ? 1 : 0;

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0 && currentStep === 1) {
      // Remove o /upload do final da rota
      const newPath = location.pathname.replace(
        /\/plano-de-contas\/[^/]+\/upload$/,
        "/plano-de-contas"
      );
      navigate(newPath);
    }
  };

  return (
    <MainContainer>
      {currentStep === 0 ? (
        <FormContainer>
          <FormControl>
            <InputLabel id="month-label">Mês</InputLabel>
            <Select
              labelId="month-label"
              value={selectedMonth}
              onChange={onMonthChange}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
            >
              {months.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ano"
            value={selectedYear}
            onChange={onYearChange}
            variant="outlined"
            size="small"
            sx={{ width: 100 }}
          />

          <IconButton color="primary" onClick={onSubmit}>
            <ArrowForward />
          </IconButton>
        </FormContainer>
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={2}
          marginLeft={-6}
          marginTop={2}
        >
          <IconButton color="primary" onClick={onBack}>
            <ArrowBackRounded onClick={() => handleStepClick(0)} />
          </IconButton>
          <Button
            variant="outlined"
            component="label"
            startIcon={<BackupOutlinedIcon />}
            color="inherit"
          >
            Subir balancete
            <input
              type="file"
              hidden
              onChange={onUpload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </Button>
        </Box>
      )}

      <StepperContainer>
        {steps.map((_, index) => (
          <StepCircle
            key={index}
            active={index === currentStep}
            onClick={onBack}
            style={{ cursor: "pointer" }}
          />
        ))}
      </StepperContainer>
    </MainContainer>
  );
};
