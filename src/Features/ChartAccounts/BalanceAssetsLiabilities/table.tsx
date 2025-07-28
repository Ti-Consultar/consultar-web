import {
  Box,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import ExcelExportIcon from "../../../assets/icons/csv_export.svg";

// Novo tipo dos dados
type FinancialRow = {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
};

interface TableTabsProps {
  ativos: FinancialRow[];
  passivos: FinancialRow[];
}

export const TableTabs = ({ ativos, passivos }: TableTabsProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const currentData = tabIndex === 0 ? ativos ?? [] : passivos ?? [];
  const tabLabel = tabIndex === 0 ? "Ativos" : "Passivos";

  const handleExportCSV = () => {
    const dataToExport = tabIndex === 0 ? ativos : passivos;

    if (!dataToExport.length) return;

    const header = [
      "Nome",
      "Centro de Custo",
      "Valor Inicial",
      "Crédito",
      "Débito",
      "Valor Final",
    ];

    const rows = dataToExport.map((row) => [
      row.name,
      row.costCenter,
      formatNumber(row.initialValue),
      formatNumber(row.credit),
      formatNumber(row.debit),
      formatNumber(row.finalValue),
    ]);

    const csvContent =
      "\uFEFF" + [header, ...rows].map((line) => line.join(";")).join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tabLabel.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (value: number) => {
    return value.toFixed(2).replace(".", ","); 
  };

  // Utilitário para formatar como moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              borderBottom: "1px 0px solid #E0E0E0",
              px: 2,
              pt: 1,
              mb: 2,
              mt: 1,
            }}
          >
            <Tab
              label="Ativo"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                minHeight: "36px",
                mr: 1,
                "&.Mui-selected": {
                  backgroundColor: "#5C57F4",
                  color: "#fff",
                },
              }}
            />
            <Tab
              label="Passivo"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                minHeight: "36px",
                "&.Mui-selected": {
                  backgroundColor: "#5C57F4",
                  color: "#fff",
                },
              }}
            />
          </Tabs>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleExportCSV}
            startIcon={<img src={ExcelExportIcon} style={{ width: "20px" }} />}
            sx={{
              color: "var(--neutral-700)",
              textTransform: "none",
              ml: "auto",
              mr: 2,
            }}
          >
            Exportar CSV
          </Button>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F4F4F4" }}>
                <TableCell sx={{ fontWeight: 600 }}>{tabLabel}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Conta</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Valor Inicial</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Crédito</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Débito</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Valor Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <TableRow key={row.id} hover sx={{ borderBottom: "none" }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.costCenter}</TableCell>
                    <TableCell>{formatCurrency(row.initialValue)}</TableCell>
                    <TableCell>{formatCurrency(row.credit)}</TableCell>
                    <TableCell>{formatCurrency(row.debit)}</TableCell>
                    <TableCell>{formatCurrency(row.finalValue)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" py={2} color="text.secondary">
                      Nenhum dado disponível.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
