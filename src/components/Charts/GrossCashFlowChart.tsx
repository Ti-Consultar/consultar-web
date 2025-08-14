import {
  ResponsiveContainer,
  BarChart,
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
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          yAxisId="left"
          orientation="left"
          tickFormatter={(value) => `R$ ${value / 1000}k`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => `${value.toFixed(1)}%`}
        />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "margemEBITIDA") return [`${value.toFixed(2)}%`, name];
            return [`R$ ${value.toLocaleString()}`, name];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="ebitida" fill="#8884d8" name="EBITDA" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="margemEBITIDA"
          stroke="#82ca9d"
          name="Margem EBITDA"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="fluxoCaixaOperacional"
          stroke="#ffc658"
          name="Fluxo de Caixa Operacional"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
