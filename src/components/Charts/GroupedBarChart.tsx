import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const seriesOptions = [
  {
    key: "initialValue",
    label: "Valor Inicial",
    color: "url(#initialGradient)",
  },
  { key: "credit", label: "Crédito", color: "url(#creditGradient)" },
  { key: "debit", label: "Débito", color: "url(#debitGradient)" },
  { key: "finalValue", label: "Valor Final", color: "url(#finalGradient)" },
];

type ChartDataItem = {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
};

type GroupedBarChartProps = {
  title?: string;
  data: ChartDataItem[];
};

export const GroupedBarChart = ({ title, data }: GroupedBarChartProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "initialValue",
    "finalValue",
  ]);

  const handleToggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 8,
          textAlign: "center",
          mb: 2
        }}
      >
        <Typography variant="h6" mt={2} color="text.secondary">
          Nenhum dado encontrado.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Não há dados de balancete para esta data.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ padding: 2, border: "1px solid var(--neutral-200)", mb: 2 }}
    >
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Checkbox controls */}
      <FormGroup row sx={{ mb: 2 }}>
        {seriesOptions.map((option) => (
          <FormControlLabel
            key={option.key}
            control={
              <Checkbox
                checked={selectedKeys.includes(option.key)}
                onChange={() => handleToggle(option.key)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 60, bottom: 20 }}
        >
          <defs>
            <linearGradient id="initialGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={1} />
              <stop offset="100%" stopColor="#1976d2" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e7d32" stopOpacity={1} />
              <stop offset="100%" stopColor="#2e7d32" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="debitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d32f2f" stopOpacity={1} />
              <stop offset="100%" stopColor="#d32f2f" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="finalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9a825" stopOpacity={1} />
              <stop offset="100%" stopColor="#f9a825" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            width={80}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip />
          <Legend />
          {seriesOptions.map(
            (option) =>
              selectedKeys.includes(option.key) && (
                <Bar
                  key={option.key}
                  dataKey={option.key}
                  name={option.label}
                  fill={option.color}
                />
              )
          )}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
