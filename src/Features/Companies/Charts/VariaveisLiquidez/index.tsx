import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import {
  AreaChart,
  Area,
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
        borderRadius: 12,
        border: "1px solid var(--neutral-300)",
        paddingRight: "26px"
      }}
    >
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTesouraria" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#560BAD" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#560BAD" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNCG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E80054" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#E80054" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCDG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#019FD3" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#019FD3" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tick={false} />
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

          <Area
            type="monotone"
            dataKey="saldoTesouraria"
            name="Tesouraria"
            stroke="#2f6bbd"
            strokeWidth={3}
            fill="url(#colorTesouraria)"
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="ncg"
            name="NCG"
            stroke="#E80054"
            strokeWidth={3}
            fill="url(#colorNCG)"
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="cdg"
            name="CDG"
            stroke="#560BAD"
            strokeWidth={3}
            fill="url(#colorCDG)"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
