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

interface LiquidityData {
  name: string;
  dateMonth: number;
  liquidezCorrente: number;
  liquidezSeca: number;
  liquidezImediata: number;
}

interface Props {
  data: LiquidityData[];
}

export const LiquidityLineChart = ({ data }: Props) => {
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
      <LineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tick={false} />
        <Tooltip
          formatter={(value: number) => value.toFixed(2)}
          labelFormatter={(label: string) => `Mês: ${label}`}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="liquidezSeca"
          name="Liquidez Seca"
          stroke="#03045E"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="liquidezCorrente"
          name="Liquidez Diária"
          stroke="#E80054"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="liquidezImediata"
          name="Liquidez Imediata"
          stroke="#FF9415"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
