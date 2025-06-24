import { Box, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Entry {
  name: string;
  initialValue: number;
  finalValue: number;
  costCenter: string;
}

interface BalanceLineChartProps {
  data: Entry[];
}

export const BalanceLineChart = ({ data }: BalanceLineChartProps) => {
  const topLevelData = data
    .filter((item) => item.costCenter.split(".").length <= 2)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Paper sx={{ mb: 2, padding: 1, border: "1px solid var(--neutral-200)" }} elevation={0}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={topLevelData}
          margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
        >
          <Legend verticalAlign="top" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            fontSize={"10px"}
            tickFormatter={(name) =>
              name.length > 12 ? name.slice(0, 12) + "..." : name
            }
          />
          <YAxis
            width={100}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip
            formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR")}`}
          />
          <Line
            type="basisOpen"
            dataKey="initialValue"
            name="Valor Inicial"
            stroke="#8884d8"
            strokeWidth={2}
            dot
          />
          <Line
            type="monotone"
            dataKey="finalValue"
            name="Valor Final"
            stroke="#82ca9d"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
