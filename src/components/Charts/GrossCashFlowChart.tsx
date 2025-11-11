import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";

type MonthData = {
  name: string;
  ebitida: number;
  margemEBITIDA: number;
  fluxoCaixaOperacional: number;
};

type Props = {
  data: MonthData[];
};

export const GrossCashFlowChart = ({ data }: Props) => {
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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={formattedData}
        margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tick={false}
          yAxisId="left"
          orientation="left"
          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
          domain={["auto", "auto"]}
        />
        <YAxis
          tick={false}
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => `${value.toFixed(1)}%`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "margemEBITIDA")
              return [`${value.toFixed(2)}%`, "Margem EBITDA"];
            return [`${value.toLocaleString("pt-BR")}`, name];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="ebitida" fill="#0B4357" name="EBITDA" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="margemEBITIDA"
          stroke="#00FF29"
          name="Margem EBITDA"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="fluxoCaixaOperacional"
          stroke="#00AABB"
          name="Fluxo de Caixa Operacional"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
