import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type LiquidityMonth = {
  name: string;
  dateMonth: number;
  saldoTesouraria: number;
  ncg: number;
  cdg: number;
  indiceDeLiquidez: number;
};

type Props = {
  data: LiquidityMonth[];
};

export const LiquidityChart: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const translateMonth = (month: string): string => {
    const months: Record<string, string> = {
      January: "Jan",
      February: "Fev",
      March: "Mar",
      April: "Abr",
      May: "Mai",
      June: "Jun",
      July: "Jul",
      August: "Ago",
      September: "Set",
      October: "Out",
      November: "Nov",
      December: "Dez",
    };
    return months[month] ?? month;
  };

  // Divide todos os valores por 1000
  const formattedData = data.map((item) => ({
    ...item,
    name: translateMonth(item.name),
    saldoTesouraria: item.saldoTesouraria / 1000,
    ncg: item.ncg / 1000,
    cdg: item.cdg / 1000,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? 220 : 300,
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: 5,
        border: "1px solid var(--neutral-300",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: 10 }}>
        Tesouraria x NCG x CDG
      </h3>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(value as number)
            }
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="saldoTesouraria"
            name="Tesouraria"
            stroke="#2f6bbd"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2f6bbd" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="ncg"
            name="NCG"
            stroke="#D14C6B"
            strokeWidth={3}
            dot={{ r: 4, fill: "#D14C6B" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="cdg"
            name="CDG"
            stroke="#4EB7AA"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4EB7AA" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
