// EvaDiagram.tsx
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

type EvaData = {
  label: string;
  economicView: {
    receitaLiquida?: number;
    custoDespesaVariavel?: number;
    margemContribuicao?: number;
    despesasOperacionais?: number;
    outrosResultadosOperacionais?: number;
    lajir?: number;
    impostos?: number;
    nopat?: number;
  };
  financialView: {
    disponivel?: number;
    clientes?: number;
    estoques?: number;
    outrosAtivosOperacionais?: number;
    fornecedores?: number;
    outrosPassivosOperacionais?: number;
    realizavelLongoPrazo?: number;
    exigivelLongoPrazo?: number;
    ativosFixos?: number;
    capitalDeGiro?: number;
    capitalInvestido?: number;
  };
  indicators: {
    nopat?: number;
    capitalInvestido?: number;
    roic?: number;
    wacc?: number;
    spread?: number;
    eva?: number;
  };
};

const formatValue = (value: number | undefined) => {
  if (value === undefined || value === 0) return "-";
  return value.toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
};

const commonStyle = {
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "#ffffffff",
  whiteSpace: "pre-line" as const,
  fontWeight: 500,
  minWidth: "220px",
  textAlign: "left" as const,
  fontSize: "14px",
};

const ParallelogramNode = ({ data }: NodeProps<EvaData>) => {
  return (
    <div
      style={{
        background: "#ffffffff",
        border: "2px solid #333",
        fontWeight: "bold",
        display: "inline-block",
        padding: "0",
        transform: "skew(-20deg)",
      }}
    >
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
    </div>
  );
};

const ParallelogramNodeTitle = ({ data }: NodeProps<EvaData>) => {
  return (
    <div
      style={{
        background: "#3270c1ff",
        border: "2px solid #333",
        fontWeight: "bold",
        display: "inline-block",
        padding: "0",
        transform: "skew(-20deg)",
      }}
    >
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  parallelogram: ParallelogramNode,
  parallelogramTitle: ParallelogramNodeTitle,
};

const title = {
  padding: "10px",
  border: "none",
  backgroundColor: "transparent",
  fontWeight: 700,
  minWidth: "220px",
  textAlign: "center" as const,
  fontSize: "18px",
  color: "#DC3545",
};

const mathOperator = {
  border: "none",
  backgroundColor: "transparent",
  fontWeight: 500,
  textAlign: "center" as const,
  color: "var(--neutral-700)",
};

const highlightStyle = {
  ...commonStyle,
  backgroundColor: "#5c5c5c",
  color: "#fff",
  fontWeight: 600,
};

type Props = {
  data: EvaData;
};

export default function EvaDiagram({ data }: Props) {
  const { economicView, financialView, indicators } = data;

  const nodes: Node[] = [
    // VISÃO ECONÔMICA
    {
      id: "title1",
      position: { x: 0, y: -80 },
      data: { label: "VISÃO ECONÔMICA" },
      style: title,
    },
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: {
        label: `(+) Receitas Líquidas`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "1.1",
      position: { x: 220, y: 0 },
      data: {
        label: `${formatValue(economicView.custoDespesaVariavel)}`,
      },
      type: "parallelogram",
    },
    {
      id: "2",
      position: { x: 0, y: 80 },
      data: {
        label: `(-) Custos + Desp.Variáveis\n(${formatValue(
          economicView.custoDespesaVariavel
        )})`,
      },
      style: commonStyle,
    },
    {
      id: "3",
      position: { x: 0, y: 160 },
      data: {
        label: `(=) Margem de Contribuição\n${formatValue(
          economicView.margemContribuicao
        )}`,
      },
      style: highlightStyle,
    },

    {
      id: "4",
      position: { x: 300, y: 0 },
      data: {
        label: `(-) Despesas Operacionais\n(${formatValue(
          economicView.despesasOperacionais
        )})`,
      },
      style: commonStyle,
    },
    {
      id: "5",
      position: { x: 300, y: 80 },
      data: {
        label: `(+/-) Outros Res. Operacionais\n${formatValue(
          economicView.outrosResultadosOperacionais
        )}`,
      },
      style: commonStyle,
    },
    {
      id: "6",
      position: { x: 300, y: 180 },
      data: { label: `(=) LAJIR\n${formatValue(economicView.lajir)}` },
      style: highlightStyle,
    },

    {
      id: "7",
      position: { x: 600, y: 0 },
      data: {
        label: `(+/-) Impostos\n(${formatValue(economicView.impostos)})`,
      },
      style: commonStyle,
    },
    {
      id: "8",
      position: { x: 600, y: 100 },
      data: { label: `(=) NOPAT\n${formatValue(economicView.nopat)}` },
      style: highlightStyle,
    },

    // VISÃO FINANCEIRA
    {
      id: "title2",
      position: { x: 0, y: 330 },
      data: { label: "VISÃO FINANCEIRA" },
      style: title,
    },
    {
      id: "9",
      position: { x: 0, y: 400 },
      data: {
        label: `(+) Disponível\n${formatValue(financialView.disponivel)}`,
      },
      style: commonStyle,
    },
    {
      id: "10",
      position: { x: 0, y: 480 },
      data: { label: `(+) Clientes\n${formatValue(financialView.clientes)}` },
      style: commonStyle,
    },
    {
      id: "11",
      position: { x: 0, y: 560 },
      data: { label: `(+) Estoques\n${formatValue(financialView.estoques)}` },
      style: commonStyle,
    },
    {
      id: "12",
      position: { x: 0, y: 640 },
      data: {
        label: `(+) Outros Ativos Operacionais\n${formatValue(
          financialView.outrosAtivosOperacionais
        )}`,
      },
      style: commonStyle,
    },
    {
      id: "13",
      position: { x: 0, y: 740 },
      data: {
        label: `(-) Fornecedores\n${formatValue(financialView.fornecedores)}`,
      },
      style: commonStyle,
    },
    {
      id: "14",
      position: { x: 0, y: 820 },
      data: {
        label: `(-) Outros Passivos Operacionais\n${formatValue(
          financialView.outrosPassivosOperacionais
        )}`,
      },
      style: commonStyle,
    },

    {
      id: "15",
      position: { x: 300, y: 450 },
      data: {
        label: `(=) Capital de Giro\n${formatValue(
          financialView.capitalDeGiro
        )}`,
      },
      style: highlightStyle,
    },
    {
      id: "16",
      position: { x: 300, y: 530 },
      data: {
        label: `(+) Realizável a Longo Prazo\n${formatValue(
          financialView.realizavelLongoPrazo
        )}`,
      },
      style: commonStyle,
    },
    {
      id: "17",
      position: { x: 300, y: 610 },
      data: {
        label: `(-) Exigível a Longo Prazo\n${formatValue(
          financialView.exigivelLongoPrazo
        )}`,
      },
      style: commonStyle,
    },
    {
      id: "18",
      position: { x: 300, y: 690 },
      data: {
        label: `(+) Ativos Fixos (Invest. Imob.)\n${formatValue(
          financialView.ativosFixos
        )}`,
      },
      style: commonStyle,
    },

    {
      id: "19",
      position: { x: 600, y: 530 },
      data: {
        label: `(=) Capital Investido\n${formatValue(
          financialView.capitalInvestido
        )}`,
      },
      style: highlightStyle,
    },

    // INDICADORES
    {
      id: "20",
      position: { x: 850, y: 280 },
      data: { label: `ROIC\n${formatValue(indicators.roic)}%` },
      style: highlightStyle,
    },
    {
      id: "21",
      position: { x: 850, y: 360 },
      data: { label: `WACC\n${formatValue(indicators.wacc)}%` },
      style: commonStyle,
    },
    {
      id: "22",
      position: { x: 1150, y: 320 },
      data: { label: `SPREAD\n${formatValue(indicators.spread)}%` },
      style: commonStyle,
    },
    {
      id: "23",
      position: { x: 1150, y: 400 },
      data: {
        label: `Capital Investido\n${formatValue(indicators.capitalInvestido)}`,
      },
      style: commonStyle,
    },
    {
      id: "24",
      position: { x: 1420, y: 370 },
      data: {
        label: `EVA Retorno do Acionista\n${formatValue(indicators.eva)}`,
      },
      style: highlightStyle,
    },

    // Operadores
    {
      id: "division",
      position: { x: 700, y: 300 },
      data: { label: "÷" },
      style: { ...mathOperator, fontSize: "55px" },
    },
    {
      id: "times",
      position: { x: 1305, y: 360 },
      data: { label: "x" },
      style: { ...mathOperator, fontSize: "30px" },
    },
  ];

  const edges: Edge[] = [
    // Caminho vertical Receitas > Custos > Margem
    { id: "e1-2", source: "1", target: "2", type: "step" },
    { id: "e2-3", source: "2", target: "3", type: "step" },
    { id: "e1-6", source: "1", target: "6", type: "step" },
    { id: "e4-5", source: "4", target: "5", type: "step" },
    { id: "e5-8", source: "5", target: "8", type: "step" },
    { id: "e8-19-1", source: "8", target: "19", type: "step" },
    { id: "e8-19-2", source: "8", target: "19", type: "step" },
    { id: "e8-20", source: "8", target: "20", type: "step" },
    { id: "e20-21", source: "20", target: "21", type: "step" },
    { id: "e20-22", source: "20", target: "22", type: "step" },
    { id: "e22-23", source: "22", target: "23", type: "step" },
    { id: "e23-24", source: "23", target: "24", type: "step" },

    { id: "e9-10", source: "9", target: "10", type: "step" },
    { id: "e10-11", source: "10", target: "11", type: "step" },
    { id: "e11-12", source: "11", target: "12", type: "step" },
    { id: "e12-13", source: "12", target: "13", type: "step" },
    { id: "e13-14", source: "13", target: "14", type: "step" },
    { id: "e10-15", source: "10", target: "15", type: "step" },
    { id: "e15-16", source: "15", target: "16", type: "step" },
    { id: "e16-17", source: "16", target: "17", type: "step" },
    { id: "e17-18", source: "17", target: "18", type: "step" },
    { id: "e16-19", source: "16", target: "19", type: "step" },
  ];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
