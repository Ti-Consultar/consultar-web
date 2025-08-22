import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CapitalStructureMonth = {
  name: string;
  dateMonth: number;
  terceirosCurtoPrazo: number | null;
  terceirosLongoPrazo: number | null;
  participacaoCapitalTerceiros: number;
  participacaoCapitalProprio: number;
};

type CapitalStructureProps = {
  data: CapitalStructureMonth[];
};

export const CapitalStructureStackedBarChart: React.FC<
  CapitalStructureProps
> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        barCategoryGap="25%"
      >
        <defs>
          <linearGradient id="colorTerceiros" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E15759" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#E15759" stopOpacity={0.6} />
          </linearGradient>

          <linearGradient id="colorProprio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4E79A7" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#4E79A7" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />

        {/* Legenda corrigida com cores fixas */}
        <Legend
          content={() => (
            <ul
              style={{
                display: "flex",
                gap: "20px",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#E15759",
                    display: "inline-block",
                  }}
                />
                Capital de Terceiros
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#4E79A7",
                    display: "inline-block",
                  }}
                />
                Capital Próprio
              </li>
            </ul>
          )}
        />

        <Bar
          dataKey="participacaoCapitalTerceiros"
          name="Capital de Terceiros"
          stackId="a"
          fill="url(#colorTerceiros)"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="participacaoCapitalProprio"
          name="Capital Próprio"
          stackId="a"
          fill="url(#colorProprio)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
