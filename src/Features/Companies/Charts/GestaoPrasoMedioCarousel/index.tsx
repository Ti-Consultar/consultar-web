import React, { useEffect } from "react";
import {
  Button,
  CarouselContainer,
  ChartWrapper,
  Dot,
  Indicators,
} from "./styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useMediaQuery, useTheme } from "@mui/material";

type MonthData = {
  name: string;
  dateMonth: number;
  clientes: number;
  estoques: number;
  fornecedores: number;
};

type Props = {
  data: MonthData[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onChangeIndex?: (index: number) => void;
};

const metrics = [
  { key: "estoques", label: "Estoques", color: "#27ae60" },
  { key: "clientes", label: "Clientes", color: "#2f6bbd" },
  { key: "fornecedores", label: "Fornecedores", color: "#C00000" },
] as const;

export const GestaoPrazoMedioCarousel: React.FC<Props> = ({
  data,
  currentIndex,
  onNext,
  onPrev,
  onChangeIndex,
}) => {
  const safeIndex =
    ((currentIndex % metrics.length) + metrics.length) % metrics.length;
  const metric = metrics[safeIndex];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    clientes: item.clientes / 10000,
    estoques: item.estoques / 10000,
    fornecedores: item.fornecedores / 10000,
    _raw: {
      clientes: item.clientes,
      estoques: item.estoques,
      fornecedores: item.fornecedores,
    },
  }));

  useEffect(() => {
    if (currentIndex !== safeIndex) {
      onChangeIndex?.(safeIndex);
    }
  }, [currentIndex, safeIndex, onChangeIndex]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <CarouselContainer>
      <Button onClick={onPrev}>‹</Button>

      <ChartWrapper>
        <div
          style={{
            height: isMobile ? 170 : 350,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            paddingRight: "36px",
            width: "100%"
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                tick={{ fill: "#000", fontSize: 12 }}
                axisLine={{ stroke: "#ccc" }}
              />
              <YAxis tick={false} axisLine={{ stroke: "#ccc" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
                formatter={(value: number, name: string, props: any) => {
                  const rawValue = props.payload._raw?.[name] ?? value;
                  return formatNumber(rawValue);
                }}
              />
              <Bar
                dataKey={metric.key}
                fill={metric.color}
                radius={[6, 6, 0, 0]}
              >
                {!isMobile && (
                  <LabelList
                    style={{ fill: "#000" }}
                    dataKey={metric.key}
                    position="top"
                    formatter={(label) => {
                      const value = typeof label === "number" ? label : 0;
                      return formatNumber(value);
                    }}
                  />
                )}
              </Bar>
            </BarChart>
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
