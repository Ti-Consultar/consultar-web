import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthData {
  name: string;
  dateMonth: number;
  saldoTesouraria: number | string;
  ncg: number | string;
  cdg: number | string;
  indiceDeLiquidez?: number;
}

interface FleurietGestaoLiquidezChartProps {
  propData: MonthData[];
}

const monthNamesPt = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const normalizeNumber = (value: number | string): number => {
  if (typeof value === "number") return value;
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  return Number(cleaned);
};

// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     const groups: { [key: string]: number } = {
//       Tesouraria: 0,
//       NCG: 0,
//       CDG: 0,
//     };

//     payload.forEach((item: any) => {
//       if (item.dataKey.includes("t")) groups["Tesouraria"] += item.value;
//       if (item.dataKey.includes("ncg")) groups["NCG"] += item.value;
//       if (item.dataKey.includes("cdg")) groups["CDG"] += item.value;
//     });

//     return (
//       <div
//         style={{ background: "white", border: "1px solid #ccc", padding: 10 }}
//       >
//         {Object.entries(groups).map(([label, value]) => (
//           <p key={label} style={{ margin: 0 }}>
//             <strong>{label}:</strong>{" "}
//             {value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

export default function FleurietGestaoLiquidezChart({
  propData,
}: FleurietGestaoLiquidezChartProps) {
  const totalBase = 100;

  const data = propData.map((month) => {
    const saldoTesouraria = normalizeNumber(month.saldoTesouraria);
    const ncg = normalizeNumber(month.ncg);
    const cdg = normalizeNumber(month.cdg);

    const ativo_t = saldoTesouraria > 0 ? saldoTesouraria : 0;
    const ativo_ncg = ncg > 0 ? ncg : 0;
    const ativo_cdg = cdg < 0 ? Math.abs(cdg) : 0;

    const passivo_t = saldoTesouraria < 0 ? Math.abs(saldoTesouraria) : 0;
    const passivo_ncg = ncg < 0 ? Math.abs(ncg) : 0;
    const passivo_cdg = cdg > 0 ? cdg : 0;

    const totalAtivo = ativo_t + ativo_ncg + ativo_cdg;
    const totalPassivo = passivo_t + passivo_ncg + passivo_cdg;
    const maxTotal = Math.max(totalAtivo, totalPassivo); // esse é o denominador comum

    const getPerc = (val: number) =>
      maxTotal === 0 ? 0 : (val / maxTotal) * totalBase;

    const ativoTotal =
      getPerc(ativo_t) + getPerc(ativo_ncg) + getPerc(ativo_cdg);
    const passivoTotal =
      getPerc(passivo_t) + getPerc(passivo_ncg) + getPerc(passivo_cdg);

    return {
      name: monthNamesPt[(month.dateMonth ?? 1) - 1],

      // ATIVO
      ativo_t: getPerc(ativo_t),
      ativo_ncg: getPerc(ativo_ncg),
      ativo_cdg: getPerc(ativo_cdg),
      ativo_espelho: totalBase - ativoTotal,

      // PASSIVO
      passivo_t: getPerc(passivo_t),
      passivo_ncg: getPerc(passivo_ncg),
      passivo_cdg: getPerc(passivo_cdg),
      passivo_espelho: totalBase - passivoTotal,
    };
  });

  return (
    <ResponsiveContainer width="40%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap={80}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {/* <Tooltip content={<CustomTooltip />} /> */}
        <Legend
          content={() => (
            <div style={{ display: "flex", gap: 16, paddingLeft: 24 }}>
              <span style={{ color: "#A9D0F5" }}>⬤ Tesouraria</span>
              <span style={{ color: "#6C8EBF" }}>⬤ NCG</span>
              <span style={{ color: "#0B3861" }}>⬤ CDG</span>
            </div>
          )}
        />

        {/* ATIVO */}
        <Bar dataKey="ativo_t" stackId="ativo" fill="#A9D0F5" />
        <Bar dataKey="ativo_ncg" stackId="ativo" fill="#6C8EBF" />
        <Bar dataKey="ativo_cdg" stackId="ativo" fill="#0B3861" />
        <Bar dataKey="ativo_espelho" stackId="ativo" fill="transparent" />

        {/* PASSIVO */}
        <Bar dataKey="passivo_t" stackId="passivo" fill="#A9D0F5" />
        <Bar dataKey="passivo_ncg" stackId="passivo" fill="#6C8EBF" />
        <Bar dataKey="passivo_cdg" stackId="passivo" fill="#0B3861" />
        <Bar dataKey="passivo_espelho" stackId="passivo" fill="transparent" />
      </BarChart>
    </ResponsiveContainer>
  );
}
