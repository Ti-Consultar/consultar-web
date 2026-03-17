import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ParallelogramNode,
  ParallelogramBudgetNode,
  ParallelogramNodeTitle,
  TitleNode,
  IconNode,
  LineNode,
  ParallelogramEVA,
} from "./NodeStyles";

// ---------- Tipagem ----------
type EvaData = {
  realizado?: {
    economicView?: Record<string, number | undefined | null>;
    financialView?: Record<string, number | undefined | null>;
    indicators?: Record<string, number | undefined | null>;
  } | null;
  orcado?: {
    economicView?: Record<string, number | undefined | null>;
    financialView?: Record<string, number | undefined | null>;
    indicators?: Record<string, number | undefined | null>;
  } | null;
};

// ---------- Utilitário ----------
const formatValue = (value?: number | null, isPercentage = false) => {
  if (value === undefined || value === null || value === 0) return "-";

  const abs = Math.abs(value);

  if (isPercentage) {
    const pct = `${abs.toFixed(2)}%`;
    return value < 0 ? `(${pct})` : pct;
  }

  const num = abs.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  return value < 0 ? `(${num})` : num;
};

const nodeTypes = {
  parallelogram: ParallelogramNode,
  parallelogramBudget: ParallelogramBudgetNode,
  parallelogramTitle: ParallelogramNodeTitle,
  parallelogramEVA: ParallelogramEVA,
  titleNode: TitleNode,
  divisionSign: IconNode,
  line: LineNode,
};

const ROW_HEIGHT = 60;

// ---------- Seções ----------
const sections = [
  {
    id: "economic",
    title: "VISÃO ECONÔMICA",
    baseY: 0,
    offsetY: 0,
    groups: [
      {
        baseX: 0,
        baseY: 0,
        items: [
          ["(+) Receitas Líquidas", "receitaLiquida"],
          ["(-) Custos + Desp.Variáveis", "custoDespesaVariavel"],
          ["(=) Margem de Contribuição", "margemContribuicao"],
        ],
      },
      {
        baseX: 630,
        baseY: 20,
        items: [
          ["(-) Despesas Operacionais", "despesasOperacionais"],
          ["(+/-) Outros Resultados", "outrosResultadosOperacionais"],
          ["(=) LAJIR", "lajir"],
        ],
      },
      {
        baseX: 1260,
        baseY: 40,
        items: [
          ["(+/-) Impostos", "impostos"],
          ["(=) NOPAT", "nopat"],
        ],
      },
    ],
  },
  {
    id: "financial",
    title: "VISÃO FINANCEIRA",
    baseY: 250,
    offsetY: 90,
    groups: [
      {
        baseX: 0,
        baseY: 0,
        items: [
          ["(+) Disponível", "disponivel"],
          ["(+) Clientes", "clientes"],
          ["(+) Estoques", "estoques"],
          ["(+) Outros Ativos", "outrosAtivosOperacionais"],
          ["(-) Fornecedores", "fornecedores"],
          ["(-) Outros Passivos", "outrosPassivosOperacionais"],
        ],
      },
      {
        baseX: 630,
        baseY: 60,
        items: [
          ["(=) Capital de Giro", "capitalDeGiro"],
          ["(+) Realizável a Longo Prazo", "realizavelLongoPrazo"],
          ["(-) Passivo Não Circulante", "exigivelLongoPrazo"],
          ["(+) Ativos Fixos", "ativosFixos"],
        ],
      },
      {
        baseX: 1260,
        baseY: 130,
        items: [["(=) Capital Investido Líquido", "capitalInvestido"]],
      },
    ],
  },
  {
    id: "accumulated",
    title: "VISÃO ACUMULADA",
    baseY: 650,
    offsetY: -10,
    groups: [
      {
        baseX: 0,
        baseY: 0,
        items: [
          ["(+) Receitas Líquidas", "receitaLiquidaAcumulado"],
          ["(-) Custos + Desp.Variáveis", "custoDespesaVariavelAcumulado"],
          ["(=) Margem de Contribuição", "margemContribuicaoAcumulado"],
        ],
      },
      {
        baseX: 630,
        baseY: 0,
        items: [
          ["(-) Despesas Operacionais", "despesasOperacionaisAcumulado"],
          ["(+/-) Outros Resultados", "outrosResultadosOperacionaisAcumulado"],
          ["(=) LAJIR", "lajirAcumulado"],
        ],
      },
      {
        baseX: 1260,
        baseY: 10,
        items: [
          ["(+/-) Impostos", "impostosAcumulado"],
          ["(=) NOPAT", "nopatAcumulado"],
        ],
      },
    ],
  },
];

// ---------- Componente ----------
export default function EvaDiagram({ data }: { data: EvaData | null | undefined }) {
  if (!data?.realizado || !data?.orcado) {
    return (
      <div
        style={{
          width: "100%",
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
          fontSize: "1.2rem",
          border: "1px dashed #ccc",
          borderRadius: 8,
          background: "#f9f9f9",
        }}
      >
        Nenhum dado disponível.
      </div>
    );
  }

  const realizadoEco = data.realizado?.economicView ?? {};
  const orcadoEco = data.orcado?.economicView ?? {};

  const realizadoFin = data.realizado?.financialView ?? {};
  const orcadoFin = data.orcado?.financialView ?? {};

  const realizadoInd = data.realizado?.indicators ?? {};
  const orcadoInd = data.orcado?.indicators ?? {};

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [];

    const getRealView = (sectionId: string) =>
      sectionId === "economic"
        ? realizadoEco
        : sectionId === "financial"
        ? realizadoFin
        : realizadoEco;

    const getBudgetView = (sectionId: string) =>
      sectionId === "economic"
        ? orcadoEco
        : sectionId === "financial"
        ? orcadoFin
        : orcadoEco;

    sections.forEach((section) => {
      const realView = getRealView(section.id) ?? {};
      const budgetView = getBudgetView(section.id) ?? {};

      result.push({
        id: `${section.id}-title`,
        type: "titleNode",
        position: { x: -200, y: section.baseY + 40 + (section.offsetY ?? 0) },
        data: { label: section.title ?? "" },
      });

      section.groups?.forEach((group, gIdx) => {
        const baseYGroup = section.baseY + (group.baseY ?? 0);

        (group.items ?? []).forEach((item: any, idx: number) => {
          const label = item?.[0] ?? "";
          const key = item?.[1] ?? "";

          const x = group.baseX ?? 0;
          const y = baseYGroup + idx * ROW_HEIGHT;

          const realValue = realView?.[key];
          const budgetValue = budgetView?.[key];

          result.push(
            {
              id: `${section.id}-${gIdx}-${idx}-title`,
              type: "parallelogramTitle",
              position: { x, y },
              data: { label },
            },
            {
              id: `${section.id}-${gIdx}-${idx}-budget`,
              type: "parallelogramBudget",
              position: { x: x + 280, y },
              data: { label: formatValue(budgetValue) },
            },
            {
              id: `${section.id}-${gIdx}-${idx}-real`,
              type: "parallelogram",
              position: { x: x + 440, y },
              data: { label: formatValue(realValue) },
            }
          );
        });
      });
    });

    const addIndicator = (
      baseY: number,
      prefix: string,
      label: string,
      key: string,
      isPct = true
    ) => {
      const x0 = 2100;
      const y = baseY;

      result.push(
        {
          id: `${prefix}-${key}-t`,
          type: "parallelogramTitle",
          position: { x: x0, y },
          data: { label: label ?? "" },
        },
        {
          id: `${prefix}-${key}-b`,
          type: "parallelogramBudget",
          position: { x: x0 + 280, y },
          data: { label: formatValue(orcadoInd?.[key], isPct) },
        },
        {
          id: `${prefix}-${key}-r`,
          type: "parallelogram",
          position: { x: x0 + 440, y },
          data: { label: formatValue(realizadoInd?.[key], isPct) },
        }
      );
    };

    addIndicator(200, "eco", "ROIC", "roic");
    addIndicator(260, "eco", "WACC", "wacc");
    addIndicator(320, "eco", "SPREAD", "spread", true);

    result.push(
      {
        id: "eva-title",
        type: "parallelogramTitle",
        position: { x: 2750, y: 260 },
        data: { label: "Árvore de Valor - EVA" },
      },
      {
        id: "eva-budget",
        type: "parallelogramBudget",
        position: { x: 3030, y: 260 },
        data: { label: formatValue(orcadoInd?.eva) },
      },
      {
        id: "eva-value",
        type: "parallelogram",
        position: { x: 3190, y: 260 },
        data: { label: formatValue(realizadoInd?.eva) },
      }
    );

    return result;
  }, [realizadoEco, realizadoFin, realizadoInd, orcadoEco, orcadoFin, orcadoInd]);

  return (
    <div style={{ width: "100%", height: 900 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        fitView
        nodesDraggable
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}