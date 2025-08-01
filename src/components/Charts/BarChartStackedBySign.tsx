import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
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

interface BarChartStackedBySignProps {
  data: ChartDataItem[];
  metrics: MetricConfig[];
  height?: number;
  width?: string;
}

const formatMillions = (value: number) => {
  return `${(value / 1_000_000).toFixed(1)}M`;
};

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

export const BarChartStackedBySign: React.FC<BarChartStackedBySignProps> = ({
  data,
  metrics,
  height = 300,
  width = "100%",
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={data}
        stackOffset="sign"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap="40%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={translateMonthTick} />
        <YAxis tickFormatter={formatMillions} width={60} />
        <Tooltip
          formatter={(value: number) =>
            value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }
        />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        {metrics.map((metric) => (
          <Bar
            key={metric.key}
            dataKey={metric.key}
            fill={metric.color}
            name={metric.label}
            stackId="stack"
            barSize={"10%"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
