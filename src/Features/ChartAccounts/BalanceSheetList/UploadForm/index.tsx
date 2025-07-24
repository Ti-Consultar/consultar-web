import React from "react";
import { Button } from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { FormContainer, MainContainer } from "./styles";

interface BalanceSheetFormProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onSubmit: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BalanceSheetForm = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onSubmit
}: BalanceSheetFormProps) => {
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onMonthChange(date.month() + 1); // month() is 0-indexed
      onYearChange(date.year());
    }
  };

  const selectedDate = dayjs()
    .month(selectedMonth - 1)
    .year(selectedYear);

  return (
    <MainContainer>
      <FormContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DatePicker
            views={["year", "month"]}
            label="Data de Referência"
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
              textField: { size: "small", variant: "outlined" },
            }}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          component="label"
          startIcon={<BackupOutlinedIcon />}
          color="primary"
        >
          Subir balancete
          <input
            type="file"
            hidden
            onChange={onSubmit}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </Button>
      </FormContainer>
    </MainContainer>
  );
};
