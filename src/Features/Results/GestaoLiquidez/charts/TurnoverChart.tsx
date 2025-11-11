import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TurnoverChart = ({ data }: { data: any[] }) => {
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
      <BarChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tick={false}/>
        <Tooltip formatter={(value: number) => `${value.toFixed(2)} dias`} />
        <Legend />
        <Bar
          dataKey="giroPMR"
          name="Prazo Médio de Recebimento"
          fill="#03045E"
        />
        <Bar dataKey="giroPMP" name="Prazo Médio de Pagamento" fill="#0077B6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TurnoverChart;
