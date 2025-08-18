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

const data = [
  {
    name: "January",
    pme: 37.44,
    pmr: 33.87,
    pmp: 63.94,
    cicloOperacoes: 7.37,
    cicloNCG: -4.31,
  },
  {
    name: "February",
    pme: 53.61,
    pmr: 24.03,
    pmp: 67.99,
    cicloOperacoes: 9.66,
    cicloNCG: 2.17,
  },
  {
    name: "March",
    pme: 44.41,
    pmr: 26.02,
    pmp: 60.94,
    cicloOperacoes: 9.5,
    cicloNCG: 0.97,
  },
  {
    name: "April",
    pme: 45.23,
    pmr: 27.87,
    pmp: 62.45,
    cicloOperacoes: 10.65,
    cicloNCG: 4.28,
  },
  {
    name: "May",
    pme: 32.05,
    pmr: 23.31,
    pmp: 42.94,
    cicloOperacoes: 12.42,
    cicloNCG: 1.39,
  },
  {
    name: "June",
    pme: 32.23,
    pmr: 25.46,
    pmp: 42.38,
    cicloOperacoes: 15.31,
    cicloNCG: 1.02,
  },
];

export default function CapitalDynamicsChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Dias", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value) => {
            const num = Number(value);
            return isNaN(num) ? value : `${num.toFixed(2)} dias`;
          }}
        />
        <Legend />

        {/* Indicadores principais */}
        <Line
          type="monotone"
          dataKey="pme"
          name="PME"
          stroke="#8884d8"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="pmr"
          name="PMR"
          stroke="#82ca9d"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="pmp"
          name="PMP"
          stroke="#ffc658"
          strokeWidth={2}
        />

        {/* Ciclos */}
        <Line
          type="monotone"
          dataKey="cicloOperacoes"
          name="Ciclo Operações"
          stroke="#ff7300"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="cicloNCG"
          name="Ciclo NCG"
          stroke="#ff0000"
          strokeDasharray="5 5"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
