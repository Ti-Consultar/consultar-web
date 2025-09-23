// EvaDiagram.tsx
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  IconNode,
  LineNode,
  ParallelogramNode,
  ParallelogramNodeTitle,
  TitleNode,
} from "./NodeStyles";

type EvaData = {
  label: string;
  economicView: {
    receitaLiquida?: number;
    receitaLiquidaAcumulado?: number;
    custoDespesaVariavel?: number;
    custoDespesaVariavelAcumulado?: number;
    margemContribuicao?: number;
    margemContribuicaoAcumulado?: number;
    despesasOperacionais?: number;
    despesasOperacionaisAcumulado?: number;
    outrosResultadosOperacionais?: number;
    outrosResultadosOperacionaisAcumulado?: number;
    lajir?: number;
    lajirAcumulado?: number;
    impostos?: number;
    impostosAcumulado?: number;
    nopat?: number;
    nopatAcumulado?: number;
  };
  financialView: {
    disponivel?: number;
    disponivelAcumulado?: number;
    clientes?: number;
    clientesAcumulado?: number;
    estoques?: number;
    estoquesAcumulado?: number;
    outrosAtivosOperacionais?: number;
    outrosAtivosOperacionaisAcumulado?: number;
    fornecedores?: number;
    fornecedoresAcumulado?: number;
    outrosPassivosOperacionais?: number;
    outrosPassivosOperacionaisAcumulado?: number;
    realizavelLongoPrazo?: number;
    realizavelLongoPrazoAcumulado?: number;
    exigivelLongoPrazo?: number;
    exigivelLongoPrazoAcumulado?: number;
    ativosFixos?: number;
    ativosFixosAcumulado?: number;
    capitalDeGiro?: number;
    capitalDeGiroAcumulado?: number;
    capitalInvestido?: number;
    capitalInvestidoAcumulado?: number;
  };
  indicators: {
    nopat?: number;
    nopatAcumulado?: number;
    capitalInvestido?: number;
    capitalInvestidoAcumulado?: number;
    roic?: number;
    roicAcumulado?: number;
    wacc?: number;
    waccAcumulado?: number;
    spread?: number;
    spreadAcumulado?: number;
    eva?: number;
    evA_Acumulado?: number;
  };
};

const formatValue = (value: number | undefined) => {
  if (value === undefined || value === 0) return "-";
  return value.toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
};

const nodeTypes = {
  parallelogram: ParallelogramNode,
  parallelogramTitle: ParallelogramNodeTitle,
  titleNode: TitleNode,
  divisionSign: IconNode,
  line: LineNode,
};

type Props = {
  data: EvaData;
};

export default function EvaDiagram({ data }: Props) {

  if (!data || !data.economicView || !data.financialView || !data.indicators) {
    return (
      <div
        style={{
          width: "100%",
          height: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#666",
          backgroundColor: "#f0f0f0",
          border: "1px dashed #ccc",
          borderRadius: 8,
        }}
      >
        Nenhum dado disponível para exibir o diagrama.
      </div>
    );
  }

  const { economicView, financialView, indicators } = data;

  const nodes: Node[] = [
    // VISÃO ECONÔMICA
    {
      id: "title1",
      position: { x: -200, y: 50 },
      data: { label: `VISÃO ECONÔMICA` },
      type: "titleNode",
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
      position: { x: 280, y: 0 },
      data: {
        label: `${formatValue(economicView.receitaLiquida)}`,
      },
      type: "parallelogram",
    },
    {
      id: "2",
      position: { x: 0, y: 60 },
      data: {
        label: `(-) Custos + Desp.Variáveis`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "2.2",
      position: { x: 280, y: 60 },
      data: {
        label: `${formatValue(economicView.custoDespesaVariavel)}`,
      },
      type: "parallelogram",
    },
    {
      id: "3",
      position: { x: 0, y: 120 },
      data: {
        label: `(=) Margem de Contribuição`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "3.3",
      position: { x: 280, y: 120 },
      data: {
        label: `${formatValue(economicView.margemContribuicao)}`,
      },
      type: "parallelogram",
    },
    {
      id: "4",
      position: { x: 470, y: 0 },
      data: {
        label: `(-) Despesas Operacionais`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "4.4",
      position: { x: 750, y: 0 },
      data: {
        label: `${formatValue(economicView.despesasOperacionais)}`,
      },
      type: "parallelogram",
    },
    {
      id: "5",
      position: { x: 470, y: 60 },
      data: {
        label: `(+/-) Outros Resultados`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "5.5",
      position: { x: 750, y: 60 },
      data: {
        label: `${formatValue(economicView.outrosResultadosOperacionais)}`,
      },
      type: "parallelogram",
    },
    {
      id: "6",
      position: { x: 470, y: 120 },
      data: { label: `(=) LAJIR` },
      type: "parallelogramTitle",
    },
    {
      id: "6.6",
      position: { x: 750, y: 120 },
      data: { label: `${formatValue(economicView.lajir)}` },
      type: "parallelogram",
    },
    {
      id: "7",
      position: { x: 950, y: 60 },
      data: {
        label: `(+/-) Impostos`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "7.7",
      position: { x: 1230, y: 60 },
      data: {
        label: `${formatValue(economicView.impostos)}`,
      },
      type: "parallelogram",
    },
    {
      id: "8",
      position: { x: 950, y: 120 },
      data: { label: `(=) NOPAT` },
      type: "parallelogramTitle",
    },
    {
      id: "8.8",
      position: { x: 1230, y: 120 },
      data: { label: `${formatValue(economicView.nopat)}` },
      type: "parallelogram",
    },

    // VISÃO FINANCEIRA
    {
      id: "title2",
      position: { x: -200, y: 360 },
      data: { label: "VISÃO FINANCEIRA" },

      type: "titleNode",
    },
    {
      id: "9",
      position: { x: 0, y: 230 },
      data: {
        label: `(+) Disponível`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "9.9",
      position: { x: 280, y: 230 },
      data: {
        label: `${formatValue(financialView.disponivel)}`,
      },
      type: "parallelogram",
    },
    {
      id: "10",
      position: { x: 0, y: 290 },
      data: { label: `(+) Clientes` },
      type: "parallelogramTitle",
    },
    {
      id: "10.1",
      position: { x: 280, y: 290 },
      data: { label: `${formatValue(financialView.clientes)}` },
      type: "parallelogram",
    },
    {
      id: "11",
      position: { x: 0, y: 350 },
      data: { label: `(+) Estoques` },
      type: "parallelogramTitle",
    },
    {
      id: "11.1",
      position: { x: 280, y: 350 },
      data: { label: `${formatValue(financialView.estoques)}` },
      type: "parallelogram",
    },
    {
      id: "12",
      position: { x: 0, y: 410 },
      data: {
        label: `(+) Outros Ativos`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "12.1",
      position: { x: 280, y: 410 },
      data: {
        label: `${formatValue(financialView.outrosAtivosOperacionais)}`,
      },
      type: "parallelogram",
    },
    {
      id: "13",
      position: { x: 0, y: 470 },
      data: {
        label: `(-) Fornecedores`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "13.1",
      position: { x: 280, y: 470 },
      data: {
        label: `${formatValue(financialView.fornecedores)}`,
      },
      type: "parallelogram",
    },
    {
      id: "14",
      position: { x: 0, y: 530 },
      data: {
        label: `(-) Outros Passivos`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "14.1",
      position: { x: 280, y: 530 },
      data: {
        label: `${formatValue(financialView.outrosPassivosOperacionais)}`,
      },
      type: "parallelogram",
    },
    {
      id: "15",
      position: { x: 470, y: 290 },
      data: {
        label: `(=) Capital de Giro`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "15.1",
      position: { x: 750, y: 290 },
      data: {
        label: `${formatValue(financialView.capitalDeGiro)}`,
      },
      type: "parallelogram",
    },
    {
      id: "16",
      position: { x: 470, y: 350 },
      data: {
        label: `(+) Realizável a Longo Prazo`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "16.1",
      position: { x: 750, y: 350 },
      data: {
        label: `${formatValue(financialView.realizavelLongoPrazo)}`,
      },
      type: "parallelogram",
    },
    {
      id: "17",
      position: { x: 470, y: 410 },
      data: {
        label: `(-) Passivo Não Circulante`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "17.1",
      position: { x: 750, y: 410 },
      data: {
        label: `${formatValue(financialView.exigivelLongoPrazo)}`,
      },
      type: "parallelogram",
    },
    {
      id: "18",
      position: { x: 470, y: 470 },
      data: {
        label: `(+) Ativos Fixos`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "18.1",
      position: { x: 750, y: 470 },
      data: {
        label: `${formatValue(financialView.ativosFixos)}`,
      },
      type: "parallelogram",
    },
    {
      id: "19",
      position: { x: 950, y: 380 },
      data: {
        label: `(=) Capital Investido Líquido`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "19.1",
      position: { x: 1230, y: 380 },
      data: {
        label: `${formatValue(indicators.capitalInvestido)}`,
      },
      type: "parallelogram",
    },

    // // INDICADORES
    {
      id: "20",
      position: { x: 1600, y: 200 },
      data: { label: `ROIC` },
      type: "parallelogramTitle",
    },
    {
      id: "20.1",
      position: { x: 1880, y: 200 },
      data: { label: `${formatValue(indicators.roic)}%` },
      type: "parallelogram",
    },
    {
      id: "21",
      position: { x: 1600, y: 260 },
      data: { label: `WACC` },
      type: "parallelogramTitle",
    },
    {
      id: "21.1",
      position: { x: 1880, y: 260 },
      data: { label: `${formatValue(indicators.wacc)}%` },
      type: "parallelogram",
    },
    {
      id: "22",
      position: { x: 1600, y: 320 },
      data: { label: `SPREAD` },
      type: "parallelogramTitle",
    },
    {
      id: "22.2",
      position: { x: 1880, y: 320 },
      data: { label: `\n${formatValue(indicators.spread)}%` },
      type: "parallelogram",
    },
    {
      id: "24",
      position: { x: 2050, y: 260 },
      data: {
        label: `Árvore de Valor - EVA`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "24.1",
      position: { x: 2330, y: 260 },
      data: {
        label: `\n${formatValue(indicators.eva)}`,
      },
      type: "parallelogram",
    },
    {
      id: "25",
      position: { x: 0, y: 650 },
      data: {
        label: `(+) Receitas Líquidas`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "title3",
      position: { x: -200, y: 710 },
      data: { label: "VISÃO ACUMULADA" },

      type: "titleNode",
    },
    {
      id: "25.1",
      position: { x: 280, y: 650 },
      data: {
        label: `\n${formatValue(economicView.receitaLiquidaAcumulado)}`,
      },
      type: "parallelogram",
    },
    {
      id: "26",
      position: { x: 0, y: 710 },
      data: {
        label: `(-) Custos + Desp. Variáveis`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "26.1",
      position: { x: 280, y: 710 },
      data: {
        label: `\n${formatValue(economicView.custoDespesaVariavelAcumulado)}`,
      },
      type: "parallelogram",
    },
    {
      id: "27",
      position: { x: 0, y: 770 },
      data: {
        label: `(=) Margem de Contribuição`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "27.1",
      position: { x: 280, y: 770 },
      data: {
        label: `\n${formatValue(economicView.margemContribuicaoAcumulado)}`,
      },
      type: "parallelogram",
    },
    {
      id: "28",
      position: { x: 470, y: 650 },
      data: {
        label: `(-) Despesas Operacionais`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "28.1",
      position: { x: 750, y: 650 },
      data: {
        label: `${formatValue(economicView.despesasOperacionaisAcumulado)}`,
      },
      type: "parallelogram",
    },
    {
      id: "29",
      position: { x: 470, y: 710 },
      data: {
        label: `(+/-) Outros Resultados`,
      },
      type: "parallelogramTitle",
    },

    {
      id: "29.1",
      position: { x: 750, y: 710 },
      data: {
        label: `${formatValue(
          economicView.outrosResultadosOperacionaisAcumulado
        )}`,
      },
      type: "parallelogram",
    },
    {
      id: "30",
      position: { x: 470, y: 770 },
      data: { label: `(=) LAJIR` },
      type: "parallelogramTitle",
    },
    {
      id: "30.1",
      position: { x: 750, y: 770 },
      data: { label: `${formatValue(economicView.lajirAcumulado)}` },
      type: "parallelogram",
    },

    {
      id: "31",
      position: { x: 950, y: 650 },
      data: {
        label: `(+/-) Impostos`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "31.1",
      position: { x: 1230, y: 650 },
      data: {
        label: `${formatValue(economicView.impostosAcumulado)}`,
      },
      type: "parallelogram",
    },
    {
      id: "32",
      position: { x: 950, y: 710 },
      data: { label: `(=) NOPAT` },
      type: "parallelogramTitle",
    },
    {
      id: "32.1",
      position: { x: 1230, y: 710 },
      data: { label: `${formatValue(economicView.nopatAcumulado)}` },
      type: "parallelogram",
    },

    {
      id: "33",
      position: { x: 1600, y: 500 },
      data: { label: `ROIC` },
      type: "parallelogramTitle",
    },
    {
      id: "33.1",
      position: { x: 1880, y: 500 },
      data: { label: `${formatValue(indicators.roicAcumulado)}%` },
      type: "parallelogram",
    },
    {
      id: "34",
      position: { x: 1600, y: 560 },
      data: { label: `WACC` },
      type: "parallelogramTitle",
    },
    {
      id: "34.1",
      position: { x: 1880, y: 560 },
      data: { label: `${formatValue(indicators.waccAcumulado)}%` },
      type: "parallelogram",
    },
    {
      id: "35",
      position: { x: 1600, y: 620 },
      data: { label: `SPREAD` },
      type: "parallelogramTitle",
    },
    {
      id: "35.2",
      position: { x: 1880, y: 620 },
      data: { label: `\n${formatValue(indicators.spreadAcumulado)}%` },
      type: "parallelogram",
    },
    {
      id: "36",
      position: { x: 2050, y: 560 },
      data: {
        label: `Árvore de Valor - EVA`,
      },
      type: "parallelogramTitle",
    },
    {
      id: "36.1",
      position: { x: 2330, y: 560 },
      data: {
        label: `\n${formatValue(indicators.evA_Acumulado)}`,
      },
      type: "parallelogram",
    },

    // Operadores
    {
      id: "division1",
      position: { x: 1480, y: 540 },
      data: "",
      type: "divisionSign",
    },
    {
      id: "division2",
      position: { x: 1480, y: 230 },
      data: "",
      type: "divisionSign",
    },

    // Linhas 1
    {
      id: "linha-vertical-1",
      type: "line",
      position: { x: 1450, y: 100 },
      data: { width: 4, height: 313 },
    },
    {
      id: "linha-horizontal-1",
      type: "line",
      position: { x: 1402, y: 100 },
      data: { width: 50, height: 4 },
    },
    {
      id: "linha-horizontal-2",
      type: "line",
      position: { x: 1400, y: 410 },
      data: { width: 53, height: 4 },
    },

    // Linhas 2
    {
      id: "linha-vertical-2",
      type: "line",
      position: { x: 1450, y: 300 },
      data: { width: 4, height: 410 },
    },
    {
      id: "linha-horizontal-2.1",
      type: "line",
      position: { x: 1400, y: 707 },
      data: { width: 53, height: 4 },
    },
  ];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
