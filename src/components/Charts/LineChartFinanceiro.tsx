import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

interface MetricConfig {
  key: string;
  label: string;
  color: string;
}

interface LineChartFinanceiroProps {
  data: ChartDataItem[];
  metrics: MetricConfig[];
  height?: number;
  width?: string;
}

const translateMonthTick = (month: string) => {
  const map: Record<string, string> = {
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

  return map[month] || month;
};

export const LineChartFinanceiro: React.FC<LineChartFinanceiroProps> = ({
  data,
  metrics,
  height = 300,
  width = "100%",
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={translateMonthTick} />
        <YAxis width={60} />
        <Tooltip formatter={(value: number) => `${value.toFixed(2)} dias`} />
        <Legend />
        {metrics.map((metric) => (
          <Line
            key={metric.key}
            type="monotone"
            dataKey={metric.key}
            stroke={metric.color}
            name={metric.label}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
