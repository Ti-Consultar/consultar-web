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
  realizado: {
    economicView: Record<string, number | undefined>;
    financialView: Record<string, number | undefined>;
    indicators: Record<string, number | undefined>;
  };
  orcado: {
    economicView: Record<string, number | undefined>;
    financialView: Record<string, number | undefined>;
    indicators: Record<string, number | undefined>;
  };
};

// ---------- Utilitário ----------
const formatValue = (value?: number, isPercentage = false) => {
  if (value === undefined || value === 0) return "-";
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
export default function EvaDiagram({ data }: { data: EvaData }) {
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

  const { realizado, orcado } = data;
  const realizadoEco = realizado.economicView;
  const orcadoEco = orcado.economicView;
  const realizadoFin = realizado.financialView;
  const orcadoFin = orcado.financialView;
  const realizadoInd = realizado.indicators;
  const orcadoInd = orcado.indicators;

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
      const realView = getRealView(section.id);
      const budgetView = getBudgetView(section.id);

      result.push({
        id: `${section.id}-title`,
        type: "titleNode",
        position: { x: -200, y: section.baseY + 40 + (section.offsetY ?? 0) },
        data: { label: section.title },
      });

      section.groups.forEach((group, gIdx) => {
        const baseYGroup = section.baseY + (group.baseY ?? 0);

        group.items.forEach((item: any, idx: number) => {
          const label = item[0];
          const key = item[1];
          const x = group.baseX;
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
              // ⚠️ ORÇADO PRIMEIRO
              id: `${section.id}-${gIdx}-${idx}-budget`,
              type: "parallelogramBudget",
              position: { x: x + 280, y },
              data: { label: formatValue(budgetValue) },
            },
            {
              // ⚠️ REALIZADO DEPOIS
              id: `${section.id}-${gIdx}-${idx}-real`,
              type: "parallelogram",
              position: { x: x + 440, y },
              data: { label: formatValue(realValue) },
            }
          );
        });
      });
    });

    // Indicadores e EVA
    const addIndicator = (
      baseY: number,
      prefix: string,
      label: string,
      key: keyof typeof realizadoInd,
      isPct = true
    ) => {
      const x0 = 2100;
      const y = baseY;
      result.push(
        {
          id: `${prefix}-${String(key)}-t`,
          type: "parallelogramTitle",
          position: { x: x0, y },
          data: { label },
        },
        {
          // ⚠️ Orçado primeiro
          id: `${prefix}-${String(key)}-b`,
          type: "parallelogramBudget",
          position: { x: x0 + 280, y },
          data: { label: formatValue(orcadoInd[key], isPct) },
        },
        {
          // ⚠️ Realizado depois
          id: `${prefix}-${String(key)}-r`,
          type: "parallelogram",
          position: { x: x0 + 440, y },
          data: { label: formatValue(realizadoInd[key], isPct) },
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
        data: { label: formatValue(orcadoInd.eva) },
      },
      {
        id: "eva-value",
        type: "parallelogram",
        position: { x: 3190, y: 260 },
        data: { label: formatValue(realizadoInd.eva) },
      }
    );

    addIndicator(500, "acc", "ROIC", "roicAcumulado");
    addIndicator(560, "acc", "WACC", "waccAcumulado");
    addIndicator(620, "acc", "SPREAD", "spreadAcumulado", true);

    result.push(
      {
        id: "eva-acum-title",
        type: "parallelogramTitle",
        position: { x: 2750, y: 560 },
        data: { label: "Árvore de Valor - EVA" },
      },
      {
        id: "eva-acum-budget",
        type: "parallelogramBudget",
        position: { x: 3030, y: 560 },
        data: { label: formatValue(orcadoInd.evA_Acumulado) },
      },
      {
        id: "eva-acum-value",
        type: "parallelogram",
        position: { x: 3190, y: 560 },
        data: { label: formatValue(realizadoInd.evA_Acumulado) },
      }
    );

    // Linhas e divisões
    result.push(
      {
        id: "division-top",
        type: "divisionSign",
        position: { x: 1980, y: 230 },
        data: "",
      },
      {
        id: "division-bottom",
        type: "divisionSign",
        position: { x: 1980, y: 540 },
        data: "",
      },
      {
        id: "line-v1",
        type: "line",
        position: { x: 1950, y: 100 },
        data: { width: 4, height: 313 },
      },
      {
        id: "line-h1",
        type: "line",
        position: { x: 1902, y: 100 },
        data: { width: 50, height: 4 },
      },
      {
        id: "line-h2",
        type: "line",
        position: { x: 1900, y: 410 },
        data: { width: 53, height: 4 },
      },
      {
        id: "line-v2",
        type: "line",
        position: { x: 1950, y: 300 },
        data: { width: 4, height: 410 },
      },
      {
        id: "line-h3",
        type: "line",
        position: { x: 1900, y: 707 },
        data: { width: 53, height: 4 },
      }
    );

    // Legenda (também invertida)
    const legendY = -150;
    result.push(
      {
        id: "legend-title",
        type: "parallelogramTitle",
        position: { x: 0, y: legendY },
        data: { label: "Legenda" },
      },
      {
        id: "legend-budget",
        type: "parallelogramBudget",
        position: { x: 290, y: legendY },
        data: { label: "Orçado" },
      },
      {
        id: "legend-real",
        type: "parallelogram",
        position: { x: 450, y: legendY },
        data: { label: "Realizado" },
      }
    );

    return result;
  }, [realizado, orcado]);

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
