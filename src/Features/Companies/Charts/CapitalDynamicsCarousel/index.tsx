import React, { useEffect } from "react";
import {
  Button,
  CarouselContainer,
  ChartWrapper,
  Dot,
  Indicators,
} from "./styles";
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

type MonthData = {
  name: string;
  dateMonth: number;
  pme: number;
  pmr: number;
  pmp: number;
  cicloFinanceiroDasOperacoesPrincipais: number;
  cicloFinanceiroNCG: number;
};

type Props = {
  data: MonthData[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onChangeIndex?: (index: number) => void;
};

const metrics = [
  { key: "pme", label: "PME", color: "#27ae60" },
  { key: "pmr", label: "PMR", color: "#2f6bbd" },
  { key: "pmp", label: "PMP", color: "#C00000" },
] as const;

export const CapitalDynamicsCarousel: React.FC<Props> = ({
  data,
  currentIndex,
  onNext,
  onPrev,
  onChangeIndex,
}) => {
  const safeIndex =
    ((currentIndex % metrics.length) + metrics.length) % metrics.length;
  const metric = metrics[safeIndex];
  const translateMonth = (month: string) => {
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

  useEffect(() => {
    if (currentIndex !== safeIndex) {
      onChangeIndex?.(safeIndex);
    }
  }, [currentIndex, safeIndex, onChangeIndex]);

  return (
    <CarouselContainer>
      <Button onClick={onPrev}>‹</Button>

      <ChartWrapper>
        <div
          style={{
            width: "100%",
            height: 350,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: 10,
              fontSize: 16,
              fontWeight: 600,
              color: "#333",
            }}
          >
            {metric.label}
          </h3>
          <ResponsiveContainer>
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#e0e0e0"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#555", fontSize: 12 }}
                axisLine={{ stroke: "#ccc" }}
              />
              <YAxis
                domain={[0, "auto"]}
                tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
                tick={{ fill: "#555", fontSize: 12 }}
                axisLine={{ stroke: "#ccc" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
                formatter={(value) => `${Number(value).toFixed(2)}%`}
              />
              <Line
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ r: 3, fill: metric.color }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              >
                <LabelList
                  dataKey={metric.key}
                  position="top"
                  content={({ value, x, y }) => {
                    if (value == null || x == null || y == null) return null;
                    return (
                      <text
                        x={x}
                        y={(y as number) - 10}
                        textAnchor="middle"
                        fill="#555"
                        fontSize={11}
                      >
                        {Number(value).toFixed(2) + "%"}
                      </text>
                    );
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      <Button onClick={onNext}>›</Button>

      <Indicators>
        {metrics.map((_, i) => (
          <Dot
            key={i}
            active={i === currentIndex}
            onClick={() => onChangeIndex?.(i)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};
