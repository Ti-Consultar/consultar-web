import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CapitalMonth = {
  name: string;
  dateMonth: number;
  pme: number;
  pmr: number;
  pmp: number;
  cicloFinanceiroDasOperacoesPrincipais: number;
  cicloFinanceiroNCG: number;
};

type CapitalDynamicsProps = {
  data: CapitalMonth[];
};

export const CapitalDynamicsChart: React.FC<CapitalDynamicsProps> = ({
  data,
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => value.toFixed(2)} />
        <Legend />

        <Line
          type="monotone"
          dataKey="pme"
          name="PME"
          stroke="#4E79A7"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="pmr"
          name="PMR"
          stroke="#F28E2B"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="pmp"
          name="PMP"
          stroke="#E15759"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cicloFinanceiroDasOperacoesPrincipais"
          name="Ciclo Financeiro (Operações)"
          stroke="#76B7B2"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cicloFinanceiroNCG"
          name="Ciclo Financeiro (NCG)"
          stroke="#59A14F"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
