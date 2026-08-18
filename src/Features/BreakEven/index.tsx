import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MainTemplate } from "../../components/AppLayout";
import CompanyNavigationDropdown from "../../components/Inputs/CompanyNavigationDropdown";
import { MonthDateInput } from "../../components/Inputs/DateInput/MonthDateInput";
import { TableValueVisualization } from "../../components/Inputs/TableValueVisualization";
import YearPicker from "../../components/Inputs/YearPicker";
import { useYear } from "../../contexts/YearContext";
import {
  getBreakEvenV2,
  simulateBreakEvenV2,
} from "../../services/apis/routes/breakEven.service";
import { getDropdownNavigation } from "../../services/apis/routes/companies.service";
import type {
  BreakEvenData,
  BreakEvenDraft,
  BreakEvenQuery,
  BreakEvenStatus,
} from "../../types/breakEven";
import type { CompanyResponse } from "../../types/companyDropdown";
import { useBreadcrumb } from "../../utils/hooks/useBreadcrumb";
import { BreakEvenTable } from "./BreakEvenTable";
import {
  applySimulationSignRule,
  createBreakEvenDraft,
  isBreakEvenDraftModified,
} from "./breakEven.utils";
import { SimulationCell } from "./SimulationCell";
import {
  ActionButton,
  Actions,
  EmptyState,
  FactorHelpButton,
  FactorGroup,
  FiltersRow,
  PageContainer,
  PageSurface,
  PageTitle,
  Toolbar,
} from "./styles";

type PendingScopeChange = (() => void) | null;

const BreakEvenPage = () => {
  const navigate = useNavigate();
  useBreadcrumb("break-even");
  const { year: contextYear, setYear: setContextYear } = useYear();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();

  const [year, setYear] = useState(contextYear);
  const [month, setMonth] = useState(1);
  const [data, setData] = useState<BreakEvenData | null>(null);
  const [draft, setDraft] = useState<BreakEvenDraft | null>(null);
  const [status, setStatus] = useState<BreakEvenStatus>("clean");
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingScopeChange, setPendingScopeChange] =
    useState<PendingScopeChange>(null);
  const requestSequence = useRef(0);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;

    const loadDropdown = async () => {
      try {
        const response = await getDropdownNavigation(Number(groupId));
        if (!cancelled) setDropdownData(response);
      } catch (error) {
        console.error("Erro ao carregar escopos do Ponto de Equilíbrio:", error);
      }
    };

    void loadDropdown();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const query = useMemo<BreakEvenQuery | null>(() => {
    if (!groupId) return null;
    return {
      groupId: Number(groupId),
      companyId: companyid ? Number(companyid) : undefined,
      subCompanyId: subCompanyId ? Number(subCompanyId) : undefined,
      year,
      month,
    };
  }, [companyid, groupId, month, subCompanyId, year]);

  const applyOfficialData = useCallback((officialData: BreakEvenData) => {
    setData(officialData);
    setDraft(createBreakEvenDraft(officialData));
    setInvalidFields(new Set());
    setStatus("clean");
  }, []);

  const loadOfficialScenario = useCallback(
    async (isRestore = false) => {
      if (!query) return false;
      const currentRequest = ++requestSequence.current;
      setLoadError(null);
      if (isRestore) setRestoring(true);
      else setLoading(true);

      try {
        const response = await getBreakEvenV2(query);
        if (requestSequence.current !== currentRequest) return false;
        applyOfficialData(response.data);
        return true;
      } catch (error) {
        if (requestSequence.current !== currentRequest) return false;
        console.error("Erro ao carregar Ponto de Equilíbrio:", error);
        setLoadError("Não foi possível carregar o cenário deste período.");
        toast.error("Não foi possível carregar o Ponto de Equilíbrio.");
        return false;
      } finally {
        if (requestSequence.current === currentRequest) {
          setLoading(false);
          setRestoring(false);
        }
      }
    },
    [applyOfficialData, query],
  );

  useEffect(() => {
    void loadOfficialScenario();
  }, [loadOfficialScenario]);

  const markDirty = useCallback(() => {
    setStatus((current) => (current === "calculating" ? current : "dirty"));
  }, []);

  const updateValidity = useCallback((field: string, valid: boolean) => {
    if (!valid) markDirty();
    setInvalidFields((current) => {
      const hasField = current.has(field);
      if ((valid && !hasField) || (!valid && hasField)) return current;
      const next = new Set(current);
      if (valid) next.delete(field);
      else next.add(field);
      if (
        valid &&
        next.size === 0 &&
        data &&
        draft &&
        !isBreakEvenDraftModified(data, draft)
      ) {
        setStatus("clean");
      }
      return next;
    });
  }, [data, draft, markDirty]);

  const handleSimulationChange = useCallback(
    (rowCode: string, value: number) => {
      if (!draft) return;
      const nextDraft = {
        ...draft,
        simulations: { ...draft.simulations, [rowCode]: value },
      };
      setDraft(nextDraft);
      setStatus(
        data &&
          invalidFields.size === 0 &&
          !isBreakEvenDraftModified(data, nextDraft)
          ? "clean"
          : "dirty",
      );
    },
    [data, draft, invalidFields],
  );

  const handleFactorChange = useCallback(
    (value: number) => {
      if (!draft) return;
      const nextDraft = { ...draft, factor: value };
      setDraft(nextDraft);
      setStatus(
        data &&
          invalidFields.size === 0 &&
          !isBreakEvenDraftModified(data, nextDraft)
          ? "clean"
          : "dirty",
      );
    },
    [data, draft, invalidFields],
  );

  const requestScopeChange = (action: () => void) => {
    if (status === "dirty") {
      setPendingScopeChange(() => action);
      return;
    }
    action();
  };

  const handleRecalculate = async () => {
    if (!query || !data || !draft || invalidFields.size > 0) return;

    setStatus("calculating");
    try {
      const response = await simulateBreakEvenV2({
        groupId: query.groupId,
        companyId: query.companyId ?? null,
        subCompanyId: query.subCompanyId ?? null,
        year: query.year,
        month: query.month,
        factor: draft.factor,
        simulations: data.rows
          .filter((row) => row.canSimulate)
          .map((row) => ({
            rowCode: row.code,
            percentage: applySimulationSignRule(
              draft.simulations[row.code] ?? 0,
              row.simulationSignRule,
            ),
          })),
      });
      applyOfficialData(response.data);
    } catch (error) {
      console.error("Erro ao recalcular Ponto de Equilíbrio:", error);
      setStatus("dirty");
      toast.error(
        "Não foi possível recalcular. Seus percentuais foram preservados.",
      );
    }
  };

  const selectedId = subCompanyId
    ? Number(subCompanyId)
    : companyid
      ? Number(companyid)
      : Number(groupId);
  const dimmed = status !== "clean";
  const hasInvalidFields = invalidFields.size > 0;

  return (
    <MainTemplate>
      <PageContainer>
        <PageSurface>
          <PageTitle>Ponto de Equilíbrio</PageTitle>

          <FiltersRow aria-label="Filtros do Ponto de Equilíbrio">
            {dropdownData && (
              <Box sx={{ minWidth: 280 }}>
                <CompanyNavigationDropdown
                  data={dropdownData.data}
                  selectedId={selectedId}
                  onChange={({ id, type, parentId }) => {
                    requestScopeChange(() => {
                      if (type === "group") {
                        navigate(`/grupos/${id}/ponto-equilibrio`);
                      } else if (type === "filial") {
                        navigate(
                          `/grupos/${groupId}/empresas/${id}/ponto-equilibrio`,
                        );
                      } else {
                        navigate(
                          `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/ponto-equilibrio`,
                        );
                      }
                    });
                  }}
                />
              </Box>
            )}
            <YearPicker
              year={year}
              onChange={(nextYear) =>
                requestScopeChange(() => {
                  setYear(nextYear);
                  setContextYear(nextYear);
                })
              }
            />
            <MonthDateInput
              label="Mês"
              size="medium"
              value={dayjs().year(year).month(month - 1)}
              onChange={(nextDate) => {
                if (!nextDate) return;
                requestScopeChange(() => setMonth(nextDate.month() + 1));
              }}
            />
            <TableValueVisualization />
          </FiltersRow>

          {loadError && !data ? (
            <Alert severity="error" action={
              <Button color="inherit" size="small" onClick={() => void loadOfficialScenario()}>
                Tentar novamente
              </Button>
            }>
              {loadError}
            </Alert>
          ) : loading && !data ? (
            <EmptyState>
              <Box display="flex" alignItems="center" gap={1.25}>
                <CircularProgress size={24} />
                Carregando cenário mensal…
              </Box>
            </EmptyState>
          ) : data && draft ? (
            <>
              {loadError && <Alert severity="error" sx={{ mb: 1 }}>{loadError}</Alert>}
              <Toolbar>
                <FactorGroup>
                  <span>Fator global</span>
                  <Tooltip
                    arrow
                    title="Percentual adicional aplicado sobre o Ponto de Equilíbrio calculado, permitindo simular uma margem acima do equilíbrio mínimo."
                  >
                    <FactorHelpButton
                      type="button"
                      aria-label="Ajuda sobre o Fator global"
                    >
                      <HelpOutlineRoundedIcon />
                    </FactorHelpButton>
                  </Tooltip>
                  <SimulationCell
                    ariaLabel="Fator global"
                    compact
                    disabled={status === "calculating" || restoring}
                    value={draft.factor}
                    onValueChange={handleFactorChange}
                    onValidityChange={(valid) => updateValidity("__factor", valid)}
                  />
                </FactorGroup>
                <Actions>
                  <ActionButton
                    type="button"
                    disabled={status === "calculating" || restoring}
                    onClick={() => void loadOfficialScenario(true)}
                  >
                    <RestartAltRoundedIcon />
                    {restoring ? "Restaurando…" : "Restaurar"}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    $primary={status !== "clean"}
                    $dirty={status === "dirty"}
                    $spinning={status === "calculating"}
                    disabled={
                      status === "calculating" || restoring || hasInvalidFields
                    }
                    title={
                      hasInvalidFields
                        ? "Corrija os percentuais inválidos antes de recalcular."
                        : undefined
                    }
                    onClick={() => void handleRecalculate()}
                  >
                    <RefreshRoundedIcon />
                    {status === "calculating"
                      ? "Recalculando…"
                      : "Recalcular Ponto de Equilíbrio"}
                  </ActionButton>
                </Actions>
              </Toolbar>

              <BreakEvenTable
                rows={data.rows}
                simulations={draft.simulations}
                dimmed={dimmed}
                disabled={status === "calculating" || restoring}
                onSimulationChange={handleSimulationChange}
                onValidityChange={updateValidity}
              />
            </>
          ) : (
            <EmptyState>Nenhum dado disponível para o período selecionado.</EmptyState>
          )}
        </PageSurface>
      </PageContainer>

      <Dialog
        open={pendingScopeChange !== null}
        onClose={() => setPendingScopeChange(null)}
        aria-labelledby="discard-break-even-title"
      >
        <DialogTitle id="discard-break-even-title">
          Descartar alterações pendentes?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Os percentuais e o Fator ainda não foram recalculados. Ao trocar o
            período ou escopo, essas alterações serão descartadas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingScopeChange(null)}>Continuar editando</Button>
          <Button
            variant="contained"
            onClick={() => {
              const action = pendingScopeChange;
              setPendingScopeChange(null);
              setStatus("clean");
              action?.();
            }}
          >
            Descartar e trocar
          </Button>
        </DialogActions>
      </Dialog>
    </MainTemplate>
  );
};

export default BreakEvenPage;
