import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Button, Container } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";

interface BalancoContabilTableProps {
  data: any[];
}

const BalancoContabilTable: React.FC<BalancoContabilTableProps> = ({
  data,
}) => {
  return (
    <div
      style={{
        border: "1px dashed #ccc",
        padding: "30px",
        textAlign: "center",
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <p style={{ color: "#777", fontSize: "1.1em" }}>
        Conteúdo da tabela Balanço Contábil será carregado aqui.
      </p>
      {data.length > 0 && (
        <div style={{ marginTop: "15px", fontSize: "0.9em", color: "#555" }}>
          <p>Dados simulados recebidos para a tabela:</p>
          <pre
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// --- Main BalancoContabil Component (replicated structure) ---
export const EficienciaOperacional = () => {
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );
  const [data, setData] = useState<any[]>([]);

  // Placeholder function for handling the search action
  const handleSearch = () => {
    // In a real application, this would trigger API calls to fetch data
    console.log("Search button clicked!");
    console.log("Current Year:", selectedYear?.format("YYYY"));
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Eficiência Operacional</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Ano"
                value={selectedYear}
                onChange={(newValue) => {
                  setSelectedYear(newValue);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              }}
            >
              Buscar
            </Button>
          </Box>

          <Container>
            <BalancoContabilTable data={data} />
          </Container>
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
