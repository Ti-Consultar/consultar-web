import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import {
  AllCommunityModule,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  SortChangedEvent,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MainTemplate } from "../../../components/AppLayout";
import { getTrialBalanceViewerRows } from "../../../services/apis/routes/balancete.service";
import {
  TRIAL_BALANCE_VIEWER_BLOCK_SIZE,
  TrialBalanceViewerFilters,
  TrialBalanceViewerItem,
  TrialBalanceViewerLocationState,
} from "../../../types/trialBalanceViewer";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { TRIAL_BALANCE_COLUMN_DEFS } from "./viewer.columns";
import { createTrialBalanceDatasource } from "./viewer.datasource";
import {
  DEFAULT_VIEWER_SORT,
  getTrialBalanceListPath,
  getViewerErrorKind,
  normalizeHierarchyLevels,
  scheduleDebouncedSearch,
} from "./viewer.utils";
import {
  CountBar,
  DegreeSelector,
  FilterGroup,
  FilterGroupLabel,
  FilterHelper,
  FilterActions,
  FilterBar,
  GridContainer,
  HeaderContent,
  LoadingDot,
  LoadingLabel,
  Metadata,
  StateOverlay,
  Title,
  ViewerContainer,
  ViewerHeader,
} from "./styles";

ModuleRegistry.registerModules([AllCommunityModule]);

type ViewerState = "loading" | "ready" | "empty" | "error" | "not-found";

const viewerTheme = themeQuartz.withParams({
  accentColor: "#3A5F9B",
  backgroundColor: "#FFFFFF",
  borderColor: "#E4E7EC",
  fontFamily: "Mona Sans, sans-serif",
  fontSize: 13,
  headerBackgroundColor: "#F9F9F9",
  headerTextColor: "#667085",
  rowHoverColor: "#F6F8FA",
  wrapperBorderRadius: 0,
});

const initialFilters: TrialBalanceViewerFilters = {
  search: "",
  levels: [],
  onlyWithMovement: false,
};

const BalanceSheetData = () => {
  useBreadcrumb("balance-sheet-data");

  const navigate = useNavigate();
  const location = useLocation();
  const { trialBalanceId: routeTrialBalanceId } = useParams<{
    trialBalanceId: string;
  }>();
  const trialBalanceId = Number(routeTrialBalanceId);
  const validTrialBalanceId =
    Number.isSafeInteger(trialBalanceId) && trialBalanceId > 0;
  const metadata = (location.state as TrialBalanceViewerLocationState | null)
    ?.trialBalance;

  const [gridApi, setGridApi] = useState<GridApi<TrialBalanceViewerItem> | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levels, setLevels] = useState<number[]>([]);
  const [onlyWithMovement, setOnlyWithMovement] = useState(false);
  const [viewerState, setViewerState] = useState<ViewerState>(
    validTrialBalanceId ? "loading" : "not-found",
  );
  const [total, setTotal] = useState<number | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [activeSort, setActiveSort] = useState(DEFAULT_VIEWER_SORT);

  useEffect(
    () => scheduleDebouncedSearch(setDebouncedSearch, search.trim()),
    [search],
  );

  const filters = useMemo<TrialBalanceViewerFilters>(
    () => ({
      search: debouncedSearch,
      levels,
      onlyWithMovement,
    }),
    [debouncedSearch, levels, onlyWithMovement],
  );

  const hasFilters = Boolean(
    filters.search || filters.levels.length || filters.onlyWithMovement,
  );
  const isOriginalOrder =
    activeSort.field === DEFAULT_VIEWER_SORT.field &&
    activeSort.direction === DEFAULT_VIEWER_SORT.direction;

  const onRequestStarted = useCallback(
    () => setPendingRequests((current) => current + 1),
    [],
  );
  const onRequestFinished = useCallback(
    () => setPendingRequests((current) => Math.max(0, current - 1)),
    [],
  );
  const onFirstPageSuccess = useCallback((nextTotal: number) => {
    setTotal(nextTotal);
    setViewerState(nextTotal === 0 ? "empty" : "ready");
  }, []);
  const onFirstPageError = useCallback((error: unknown) => {
    setTotal(null);
    setViewerState(
      getViewerErrorKind(error) === "not-found" ? "not-found" : "error",
    );
  }, []);
  const onAdditionalPageError = useCallback(() => {
    toast.error("Não foi possível carregar mais linhas. Tente rolar novamente.", {
      id: "trial-balance-additional-block-error",
    });
  }, []);

  useEffect(() => {
    if (!gridApi || !validTrialBalanceId) return;

    const datasource = createTrialBalanceDatasource({
      trialBalanceId,
      filters,
      loadRows: getTrialBalanceViewerRows,
      onRequestStarted,
      onRequestFinished,
      onFirstPageSuccess,
      onFirstPageError,
      onAdditionalPageError,
    });

    setViewerState("loading");
    setTotal(null);
    gridApi.setGridOption("datasource", datasource);
    gridApi.purgeInfiniteCache();

    return () => datasource.destroy?.();
  }, [
    filters,
    gridApi,
    onAdditionalPageError,
    onFirstPageError,
    onFirstPageSuccess,
    onRequestFinished,
    onRequestStarted,
    trialBalanceId,
    validTrialBalanceId,
  ]);

  const handleGridReady = useCallback(
    (event: GridReadyEvent<TrialBalanceViewerItem>) => setGridApi(event.api),
    [],
  );

  const handleSortChanged = useCallback(
    (event: SortChangedEvent<TrialBalanceViewerItem>) => {
      const sortedColumn = event.api
        .getColumnState()
        .find((column) => column.sort === "asc" || column.sort === "desc");

      setActiveSort(
        sortedColumn?.sort
          ? {
              field: sortedColumn.colId as typeof DEFAULT_VIEWER_SORT.field,
              direction: sortedColumn.sort,
            }
          : DEFAULT_VIEWER_SORT,
      );
    },
    [],
  );

  const handleRetry = () => {
    if (!gridApi) return;
    setViewerState("loading");
    setTotal(null);
    gridApi.purgeInfiniteCache();
  };

  const handleClearFilters = () => {
    setSearch(initialFilters.search);
    setDebouncedSearch(initialFilters.search);
    setLevels(initialFilters.levels);
    setOnlyWithMovement(initialFilters.onlyWithMovement);
  };

  const handleRestoreOrder = () => {
    gridApi?.applyColumnState({
      defaultState: { sort: null },
      state: [],
    });
  };

  const handleBack = () => navigate(getTrialBalanceListPath(location.pathname));

  const metadataItems = [
    metadata?.reference,
    metadata?.company,
    metadata?.branch,
    metadata?.fileName,
  ].filter(Boolean) as string[];

  const renderOverlay = () => {
    if (viewerState === "loading") {
      return (
        <StateOverlay role="status">
          <CircularProgress size={28} />
          <p>Carregando linhas do balancete...</p>
        </StateOverlay>
      );
    }

    if (viewerState === "not-found") {
      return (
        <StateOverlay role="alert">
          <h2>Balancete não encontrado</h2>
          <p>
            O balancete não existe ou não está disponível para o seu usuário.
          </p>
          <Button variant="outlined" onClick={handleBack}>
            Voltar à listagem
          </Button>
        </StateOverlay>
      );
    }

    if (viewerState === "error") {
      return (
        <StateOverlay role="alert">
          <h2>Não foi possível carregar o balancete</h2>
          <p>Verifique sua conexão e tente novamente.</p>
          <Button
            variant="contained"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleRetry}
          >
            Tentar novamente
          </Button>
        </StateOverlay>
      );
    }

    if (viewerState === "empty") {
      return (
        <StateOverlay>
          <h2>{hasFilters ? "Nenhum resultado" : "Balancete sem linhas"}</h2>
          <p>
            {hasFilters
              ? "Ajuste ou limpe os filtros para consultar outras contas."
              : "Este balancete ainda não possui linhas disponíveis."}
          </p>
          {hasFilters && (
            <Button variant="outlined" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
          )}
        </StateOverlay>
      );
    }

    return null;
  };

  return (
    <MainTemplate>
      <ViewerContainer>
        <ViewerHeader>
          <Tooltip title="Voltar à listagem">
            <IconButton size="small" onClick={handleBack} aria-label="Voltar">
              <ArrowBackRoundedIcon />
            </IconButton>
          </Tooltip>
          <HeaderContent>
            <Title>Balancete</Title>
            <Metadata>
              <span>Balancete #{routeTrialBalanceId}</span>
              {metadataItems.map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </Metadata>
          </HeaderContent>
        </ViewerHeader>

        <FilterBar aria-label="Filtros do balancete">
          <FilterGroup $wide>
            <FilterGroupLabel>Buscar contas</FilterGroupLabel>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Número da conta ou descrição"
              aria-label="Buscar conta ou descrição"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterGroupLabel>Graus contábeis</FilterGroupLabel>
            <DegreeSelector role="group" aria-label="Graus contábeis">
              {[1, 2, 3, 4, 5].map((level) => (
                <ToggleButton
                  key={level}
                  size="small"
                  value={level}
                  selected={levels.includes(level)}
                  onClick={() =>
                    setLevels(normalizeHierarchyLevels([level]))
                  }
                  aria-label={`Até o grau ${level}`}
                >
                  <Tooltip
                    title={
                      level === 1
                        ? "Exibe contas de grau 1"
                        : `Inclui os graus de 1 a ${level}`
                    }
                    arrow
                  >
                    <span>{level}</span>
                  </Tooltip>
                </ToggleButton>
              ))}
            </DegreeSelector>
            <FilterHelper>Selecione o grau máximo desejado.</FilterHelper>
          </FilterGroup>

          <FilterGroup>
            <FilterGroupLabel>Movimentação</FilterGroupLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={onlyWithMovement}
                  onChange={(event) =>
                    setOnlyWithMovement(event.target.checked)
                  }
                  sx={{
                    width: 46,
                    height: 26,
                    p: 0,
                    mr: 1,
                    "& .MuiSwitch-switchBase": {
                      p: "3px",
                      transitionDuration: "180ms",
                      "&.Mui-checked": {
                        transform: "translateX(20px)",
                        color: "#fff",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "var(--branding-default-blue)",
                          opacity: 1,
                        },
                      },
                    },
                    "& .MuiSwitch-thumb": {
                      width: 20,
                      height: 20,
                      boxShadow: "0 1px 3px rgba(16, 24, 40, 0.24)",
                    },
                    "& .MuiSwitch-track": {
                      borderRadius: 13,
                      backgroundColor: "var(--neutral-300)",
                      opacity: 1,
                    },
                  }}
                />
              }
              label="Somente com movimento"
              sx={{
                height: 40,
                m: 0,
                px: 1.25,
                border: "1px solid var(--neutral-200)",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                color: "var(--neutral-600)",
                "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
              }}
            />
          </FilterGroup>

          <FilterActions>
            <Button
              size="small"
              color="inherit"
              startIcon={<ClearRoundedIcon />}
              onClick={handleClearFilters}
              disabled={!search && levels.length === 0 && !onlyWithMovement}
            >
              Limpar filtros
            </Button>
            {!isOriginalOrder && (
              <Button size="small" onClick={handleRestoreOrder}>
                Restaurar ordem original
              </Button>
            )}
          </FilterActions>
        </FilterBar>

        <CountBar>
          <span>
            {total === null
              ? "Contando linhas..."
              : `${total.toLocaleString("pt-BR")} ${
                  total === 1 ? "linha" : "linhas"
                }${hasFilters ? " encontradas" : ""}`}
          </span>
          {pendingRequests > 0 && viewerState === "ready" && (
            <LoadingLabel>
              <LoadingDot /> Carregando mais linhas
            </LoadingLabel>
          )}
        </CountBar>

        <GridContainer>
          <AgGridReact<TrialBalanceViewerItem>
            theme={viewerTheme}
            columnDefs={TRIAL_BALANCE_COLUMN_DEFS}
            defaultColDef={{
              sortable: true,
              resizable: true,
              suppressHeaderMenuButton: true,
            }}
            rowModelType="infinite"
            cacheBlockSize={TRIAL_BALANCE_VIEWER_BLOCK_SIZE}
            maxBlocksInCache={5}
            maxConcurrentDatasourceRequests={2}
            infiniteInitialRowCount={TRIAL_BALANCE_VIEWER_BLOCK_SIZE}
            rowHeight={36}
            headerHeight={40}
            suppressMultiSort
            enableCellTextSelection
            ensureDomOrder
            animateRows={false}
            getRowId={({ data }) => String(data.id)}
            onGridReady={handleGridReady}
            onSortChanged={handleSortChanged}
          />
          {renderOverlay()}
        </GridContainer>
      </ViewerContainer>
    </MainTemplate>
  );
};

export default BalanceSheetData;
