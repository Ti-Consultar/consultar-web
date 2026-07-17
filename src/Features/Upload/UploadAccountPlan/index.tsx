import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { AlertModal } from "../../../components/AlertModal";
import { MainTemplate } from "../../../components/AppLayout";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  deleteAccountPlan,
  getPaginatedAccountPlanAccounts,
  importAccountPlanAccounts,
  PaginatedAccountPlanAccounts,
  replaceAccountPlanAccounts,
  ReplaceAccountPlanResponse,
} from "../../../services/apis/routes/accountplan.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { AccountPlanTable } from "./AccountPlanTable";
import { AccountPlanUploadForm } from "./UploadForm";
import { AccountPlanUploadModal } from "./UploadModal";
import {
  ContentContainer,
  HeaderContainer,
  MainContainer,
  PageSubtitle,
  PageTitle,
} from "./styles";

const DEFAULT_TAKE = 50;

type ApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      errorMessage?: string[];
    };
  };
};

const showReplacementSummaryToast = (
  response: ReplaceAccountPlanResponse
) => {
  toast.success(
    response.message || "Plano de contas substituído com sucesso.",
    {
      duration: Infinity,
      position: "bottom-right",
      description: (
        <Box display="grid" gap={0.75} mt={0.75} color="text.secondary">
          <Typography variant="body2">
            <strong>Novas Contas: {response.newAccountsCount}</strong>
          </Typography>
          <Typography variant="body2">
            <strong>Atualizadas: {response.updatedAccountsCount}</strong>
          </Typography>
          <Typography variant="body2">
            <strong>Contas Removidas: {response.removedAccountsCount}</strong>
          </Typography>
          <Typography variant="body2">
            <strong>Importadas: {response.importedAccountsCount}</strong>
          </Typography>
        </Box>
      ),
    }
  );
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object") return fallback;

  const apiError = error as ApiError;
  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.errorMessage?.[0] ||
    apiError.message ||
    fallback
  );
};

const UploadAccountPlan = () => {
  useBreadcrumb("upload-account-plan");

  const { groupId, companyid, subCompanyId } = useParams();
  const { setLoading: setGlobalLoading } = useLoading();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedAccountPlanAccounts | null>(null);
  const [pagination, setPagination] = useState({ skip: 0, take: DEFAULT_TAKE });
  const [refreshKey, setRefreshKey] = useState(0);
  const [name, setName] = useState<string | null>();
  const [hasAccountPlan, setHasAccountPlan] = useState(false);
  const [accountPlanOrigin, setAccountPlanOrigin] = useState<string>();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const requestIdRef = useRef(0);

  const { accountPlanId, accountPlanContextKey } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId,
  });

  const currentContextKey = `g:${groupId || 0}-c:${companyid || 0}-s:${
    subCompanyId || 0
  }`;
  const activeAccountPlanId =
    accountPlanContextKey === currentContextKey ? accountPlanId : null;
  const isReplacement = hasAccountPlan;

  const fetchAccounts = useCallback(async () => {
    if (!activeAccountPlanId) return;

    const requestId = ++requestIdRef.current;

    setTableLoading(true);
    setTableError(null);

    try {
      const response = await getPaginatedAccountPlanAccounts(
        activeAccountPlanId,
        pagination.skip,
        pagination.take,
        debouncedSearch
      );

      if (requestId !== requestIdRef.current) return;
      setData(response);
      setName(response.name);

      if (!debouncedSearch) {
        setHasAccountPlan(response.totalCount > 0);
        setAccountPlanOrigin(response.accounts[0]?.origin);
      }
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;

      setTableError(
        getApiErrorMessage(error, "Erro ao carregar o plano de contas.")
      );
    } finally {
      if (requestId === requestIdRef.current) setTableLoading(false);
    }
  }, [
    activeAccountPlanId,
    debouncedSearch,
    pagination.skip,
    pagination.take,
  ]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts, refreshKey]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedSearch = search.trim();

      setDebouncedSearch((current) =>
        current === normalizedSearch ? current : normalizedSearch
      );
      setPagination((current) =>
        current.skip === 0 ? current : { ...current, skip: 0 }
      );
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    requestIdRef.current += 1;
    setData(null);
    setTableLoading(false);
    setTableError(null);
    setPagination({ skip: 0, take: DEFAULT_TAKE });
    setHasAccountPlan(false);
    setAccountPlanOrigin(undefined);
    setSearch("");
    setDebouncedSearch("");
  }, [groupId, companyid, subCompanyId]);

  const isSupportedFile = (file: File) => {
    const fileName = file.name.toLowerCase();

    return (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".csv") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/csv" ||
      file.type === "application/csv"
    );
  };

  const handleUpload = async (file: File) => {
    if (!isSupportedFile(file)) {
      toast.error("Envie um arquivo no formato .xlsx ou .csv.");
      return false;
    }

    if (!activeAccountPlanId) {
      toast.error("Plano de contas não encontrado para este contexto.");
      return false;
    }

    setUploading(true);
    setGlobalLoading(true, "Importando plano de contas...");

    try {
      if (isReplacement) {
        const response = await replaceAccountPlanAccounts(
          file,
          activeAccountPlanId
        );
        showReplacementSummaryToast(response);
      } else {
        const response = await importAccountPlanAccounts(
          file,
          activeAccountPlanId
        );
        toast.success(
          response.message || "Plano de contas importado com sucesso."
        );
      }

      setSearch("");
      setDebouncedSearch("");
      setPagination((current) => ({ ...current, skip: 0 }));
      setRefreshKey((current) => current + 1);
      return true;
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          "Erro ao importar o plano de contas. Verifique o arquivo e tente novamente."
        )
      );
      return false;
    } finally {
      setUploading(false);
      setGlobalLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);

    if (!activeAccountPlanId) {
      toast.error("Plano de contas não encontrado para este contexto.");
      return;
    }

    setGlobalLoading(true, "Excluindo plano de contas...");

    try {
      await deleteAccountPlan(activeAccountPlanId);

      requestIdRef.current += 1;
      setData(null);
      setTableError(null);
      setPagination({ skip: 0, take: DEFAULT_TAKE });
      setHasAccountPlan(false);
      setAccountPlanOrigin(undefined);
      setSearch("");
      setDebouncedSearch("");
      toast.success("Plano de contas excluído com sucesso.");
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError.response?.status === 404) {
        setData(null);
        setTableError(null);
        setHasAccountPlan(false);
        setAccountPlanOrigin(undefined);
        setSearch("");
        setDebouncedSearch("");
        toast.error("Plano de contas não encontrado.");
        return;
      }

      toast.error(
        getApiErrorMessage(error, "Erro ao excluir o plano de contas.")
      );
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <div>
            <PageTitle>Plano de Contas</PageTitle>
            <PageSubtitle>
              Consulte o plano atual ou envie um novo arquivo para a empresa
              selecionada.
            </PageSubtitle>
          </div>

          <AccountPlanUploadForm
            hasAccountPlan={hasAccountPlan}
            isReplacement={isReplacement}
            onDeleteClick={() => setDeleteModalOpen(true)}
            onUploadClick={() => setUploadModalOpen(true)}
          />
        </HeaderContainer>

        <ContentContainer>
          <AccountPlanTable
            data={data}
            hasAccountPlan={hasAccountPlan}
            origin={accountPlanOrigin}
            search={search}
            loading={tableLoading}
            error={tableError}
            onRetry={fetchAccounts}
            onSearchChange={setSearch}
            onPaginationChange={(skip, take) =>
              setPagination({ skip, take })
            }
          />
        </ContentContainer>
      </MainContainer>

      <AccountPlanUploadModal
        isReplacement={isReplacement}
        open={uploadModalOpen}
        uploading={uploading}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <AlertModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Plano de Contas"
        type="error"
        confirmText="Excluir"
        message={
          <>
            Tem certeza de que deseja excluir o Plano de Contas de{" "}
            <strong>{name || "empresa selecionada"}</strong>? Essa ação
            excluirá permanentemente todas as classificações vinculadas à
            empresa e não poderá ser desfeita.
          </>
        }
      />
    </MainTemplate>
  );
};

export default UploadAccountPlan;
