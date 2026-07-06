import { useEffect, useState, useMemo } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getBalancoReclassificadoVariation } from "../../../services/apis/routes/classification.service";
import { toast } from "sonner";
import { Month } from "../../../types/balanco";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { ExportDialog } from "../../../components/ExportModal";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { ExportButton } from "../../../components/Button/ExportButton";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { metricNature } from "./metricNature";
import { BalancoReclassificadoTable } from "./table";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import YearPicker from "../../../components/Inputs/YearPicker";
import { useYear } from "../../../contexts/YearContext";

const BalancoReclassificado = () => {
  useBreadcrumb("financial-statements");

  const [tabValue, setTabValue] = useState<number>(1);
  const { year, setYear } = useYear();
  const { setLoading } = useLoading();
  const [realizadoMonths, setRealizadoMonths] = useState<Month[]>([]);
  const [orcadoMonths, setOrcadoMonths] = useState<Month[]>([]);
  const [variacaoMonths, setVariacaoMonths] = useState<Month[]>([]);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });
  const financialScope = {
    groupId,
    companyId: companyid,
    subCompanyId,
  };

  const highlightRows = useMemo(() => {
    const ids: Record<number, boolean> = {};

    const nomesParaDestacar = [
      "Ativo Financeiro",
      "Ativo Operacional",
      "Ativo Não Circulante",
      "Ativo Fixo",
      "Passivo Financeiro",
      "Passivo Operacional",
      "Outros Ativos Operacionais Total",
      "Passivo Não Circulante",
      "Outros Passivos Operacionais Total",
      "Patrimônio Liquido",
      "Receita Operacional Bruta",
      "(-) Deduções da Receita Bruta",
      "(=) Receita Líquida de Vendas",
      "Lucro Bruto",
      "Margem Bruta %",
      "Margem Contribuição",
      "Margem Contribuição %",
      "(-) Despesas Operacionais",
      "Lucro Operacional",
      "Margem Operacional %",
      "Lucro Antes do Resultado Financeiro",
      "Margem LAJIR %",
      "Resultado do Exercício Antes do Imposto",
      "Margem LAIR %",
      "Lucro Líquido do Periodo",
      "Margem Líquida %",
      "EBITDA",
      "Margem EBITDA %",
      "NOPAT",
      "Margem NOPAT %",
      "Outros Resultados"
    ];

    realizadoMonths.forEach((month) => {
      month.totalizer.forEach((tot) => {
        if (nomesParaDestacar.includes(tot.name)) {
          ids[tot.id] = true;
        }
      });
    });

    return ids;
  }, [realizadoMonths]);

  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao buscar dropdown");
    }
  };

  useEffect(() => {
    const loadSetting = () => {
      const savedSetting = localStorage.getItem("showBudgetColumns");
      setShowBudgetColumns(savedSetting === "true");
    };

    loadSetting();

    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

  const handleSearch = async (explicitTab?: number): Promise<void> => {
    try {
      setLoading(true, "Buscando Balanço Contábil");

      if (!accountPlanId) {
        toast.warning("Plano de contas não encontrado");
        return;
      }

      const tab = explicitTab ?? tabValue;
      const response = await getBalancoReclassificadoVariation(
        accountPlanId,
        year,
        tab,
        financialScope,
      );

      const data = response.data ?? {};
      setRealizadoMonths(data.realizado?.months ?? []);
      setOrcadoMonths(data.orcado?.months ?? []);
      setVariacaoMonths(data.variacao?.months ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar buscar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (
    _event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setTabValue(newValue);
  };

  const buildExportData = (months: Month[]) => {
    if (!months.length) return { columns: [], rows: [] };

    // Colunas: "Conta / Classificação" + cada mês
    const columns = [
      { label: "Conta / Classificação", accessor: (row: any) => row.name },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row.values[m.id] ?? "-",
      })),
    ];
    // Linhas
    const rows: any[] = [];

    const addRow = (name: string, values: Record<number, number | string>) => {
      rows.push({ name, values });
    };

    // Itera os meses
    months.forEach((month) => {
      // Totalizadores do mês
      month.totalizer?.forEach((tot) => {
        // Linha do totalizador
        let existing = rows.find((r) => r.name === tot.name);
        if (!existing) {
          addRow(tot.name, {});
          existing = rows.find((r) => r.name === tot.name);
        }
        existing.values[month.id] = tot.totalValue;

        // Classificações
        tot.classifications?.forEach((cls) => {
          let existingCls = rows.find((r) => r.name === `   ${cls.name}`);
          if (!existingCls) {
            addRow(`   ${cls.name}`, {});
            existingCls = rows.find((r) => r.name === `   ${cls.name}`);
          }
          existingCls.values[month.id] = cls.value;
        });
      });

      // Total geral do mês
      if (month.monthPainelContabilTotalizer) {
        let existingTotGeral = rows.find(
          (r) => r.name === month.monthPainelContabilTotalizer.name,
        );
        if (!existingTotGeral) {
          addRow(month.monthPainelContabilTotalizer.name, {});
          existingTotGeral = rows.find(
            (r) => r.name === month.monthPainelContabilTotalizer.name,
          );
        }
        existingTotGeral.values[month.id] =
          month.monthPainelContabilTotalizer.totalValue;
      }
    });

    return { columns, rows };
  };

  const handleExport = (format: string) => {
    if (!realizadoMonths.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } = buildExportData(realizadoMonths);

    switch (format) {
      case "PDF":
        exportPDF(
          rows,
          columns,
          `demonstracoes-${entityName}-${year}`,
          "landscape",
        );
        break;
      case "CSV":
        exportCSV(
          rows,
          columns,
          `demonstracoes-${entityName}-${year}`,
        );
        break;
      case "EXCEL":
        exportExcel(
          rows,
          columns,
          `demonstracoes-${entityName}-${year}`,
        );
        break;
      case "PPT":
        exportPPTX(
          rows,
          columns,
          `demonstracoes-${entityName}-${year}`,
        );
        break;
    }
  };

  useEffect(() => {
    if (!accountPlanId) return;
    handleSearch(tabValue);
    fetchDropdown();
  }, [tabValue, year, accountPlanId, groupId, companyid, subCompanyId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Demonstrações Financeiras</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              width: "100%",
              mb: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="Tabs Ativo/Passivo"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--neutral-700)",
                },
              }}
            >
              <Tab
                label="Ativo"
                value={1}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="Passivo"
                value={2}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="Demonstrações Financeiras"
                value={3}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
            </Tabs>
          </Box>

          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              {dropdownData && (
                <Box sx={{ width: "30%" }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={subCompanyId ? Number(subCompanyId) : companyid ? Number(companyid) : Number(groupId)}
                    onChange={({ id, type, parentId }) => {
                      if (type === "group")
                        return navigate(
                          `/grupos/${id}/demonstracoes-contabeis`,
                        );
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/demonstracoes-contabeis`,
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/demonstracoes-contabeis`,
                        );
                    }}
                  />
                </Box>
              )}

              <YearPicker year={year} onChange={(year) => setYear(year)} />

              <TableValueVisualization />
              <ExportButton onClick={() => setExportMenuOpen(true)} />
            </Box>
            <div>
              <BudgetToggleButton
                showBudgetColumns={showBudgetColumns}
                setShowBudgetColumns={setShowBudgetColumns}
              />
            </div>
          </Box>

          <Container>
            <BalancoReclassificadoTable
              realizado={{ months: realizadoMonths }}
              orcado={{ months: orcadoMonths }}
              variacao={{ months: variacaoMonths }}
              showBudgetColumns={showBudgetColumns}
              highlightRows={highlightRows}
              nestedMode={tabValue === 3 ? "DRE" : "NONE"}
              metricNature={metricNature}
            />
          </Container>
        </Paper>
      </MainContainer>
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportMenuOpen(false)}
        hasChart={false}
        onExport={handleExport}
      />
    </MainTemplate>
  );
};

export default BalancoReclassificado;
