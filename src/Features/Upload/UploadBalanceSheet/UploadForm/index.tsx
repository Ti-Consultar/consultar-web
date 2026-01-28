import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { FormContainer, MainContainer } from "./styles";
import CompanyNavigationDropdown from "../../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../../services/apis/routes/companies.service";
import { useNavigate, useParams } from "react-router";

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
  onSubmit,
}: BalanceSheetFormProps) => {
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  
  const { groupId, companyid, subcompanyid } = useParams();
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onMonthChange(date.month() + 1);
      onYearChange(date.year());
    }
  };

  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao buscar dropdown");
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchDropdown();
    }
  }, [groupId]);

  const selectedDate = dayjs()
    .month(selectedMonth - 1)
    .year(selectedYear);

  return (
    <MainContainer>
      <FormContainer>
        {dropdownData && (
          <Box sx={{ width: "20%" }}>
            <CompanyNavigationDropdown
              data={dropdownData.data}
              selectedId={companyid ? Number(companyid) : Number(groupId)}
              onChange={({ id, type }) => {
                if (type === "group")
                  return navigate(`/grupos/${id}/arquivos/upload/balancete`);
                if (type === "filial")
                  return navigate(
                    `/grupos/${groupId}/empresas/${id}/arquivos/upload/balancete`,
                  );
                if (type === "sub")
                  return navigate(
                    `/grupos/${groupId}/empresas/${companyid}/filiais/${id}/arquivos/upload/balancete`,
                  );
              }}
            />
          </Box>
        )}
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
