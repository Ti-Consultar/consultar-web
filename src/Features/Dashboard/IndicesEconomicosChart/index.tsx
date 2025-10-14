import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

type ProfitabilityMonth = {
  name: string;
  dateMonth: number;
  margemBruta: number;
  margemEBITDA: number;
  margemOperacional: number;
  margemNOPAT: number;
  margemLiquida: number;
};

type Props = {
  data: ProfitabilityMonth[];
  metricKey: keyof ProfitabilityMonth;
  title?: string;
  stroke?: string;
};

export const MarginChart: React.FC<Props> = ({
  data,
  metricKey,
  title,
  stroke,
}) => {
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
  }));

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? 170 : 220,
        backgroundColor: "#fff",
        paddingRight: "36px",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: 10 }}>
        {title ?? metricKey}
      </h3>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tick={false} />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Line
            type="monotone"
            dataKey={metricKey}
            stroke={stroke ? stroke : "#2f6bbd"}
            strokeWidth={3}
            dot={{ r: 4, fill: stroke ? stroke : "#2f6bbd" }}
            activeDot={{ r: 6 }}
          >
            {!isMobile && (
              <LabelList
                dataKey={metricKey}
                position="top"
                content={({ value, x, y }) => {
                  if (value == null || x == null || y == null) return null;
                  return (
                    <text
                      x={x as number}
                      y={(y as number) - 10}
                      textAnchor="middle"
                      fill="#000"
                      fontSize={12}
                    >
                      {(value as number).toFixed(2) + "%"}
                    </text>
                  );
                }}
              />
            )}
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
