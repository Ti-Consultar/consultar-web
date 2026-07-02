import {
  HeaderContainer,
  ListContainer,
  MainContainer,
  OptionsContainer,
  Subtitle,
  Title,
} from "./styles";
import { Alert, Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import UploadIcon from "../../../assets/images/import-file.png";

import { toast } from "sonner";
import { BalanceSheetForm } from "./UploadForm";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  deleteBalancete,
  editBalanceSheetColumns,
  getBalanceSheetConfig,
  getBalancetes,
  hasBalanceMapping,
  importAccountingWithMapping,
  submitAccounting,
} from "../../../services/apis/routes/balancete.service";
import { BalancetePayload } from "../../../types/balancetePayload";
import { MainTemplate } from "../../../components/AppLayout";
import { BalanceSheetUploadTable } from "./table";
import { Balancetes } from "../../../types/balancete";
import { AlertModal } from "../../../components/AlertModal";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { BalanceColumnMappingModal } from "../BalanceColumnMapping/BalanceColumnMappingModal";

const UploadBalanceSheet = () => {
  const location = useLocation();
  useBreadcrumb(
    location.pathname.includes("/balancetes")
      ? "balance-sheets"
      : "upload-balance-sheet"
  );
  const basePath = location.pathname;
  const navigate = useNavigate();
  const { groupId, companyid, subCompanyId } = useParams();
  const { setLoading } = useLoading();
  const [balanceteList, setBalanceteList] = useState<Balancetes>({
    id: 0,
    balancetes: [],
  });
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedBalanceteId, setSelectedBalanceteId] = useState<number | null>(
    null,
  );
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });
  const getFinancialScope = () => ({
    groupId: groupId ? Number(groupId) : undefined,
    companyId: companyid ? Number(companyid) : undefined,
    subCompanyId: subCompanyId ? Number(subCompanyId) : undefined,
  });
  const [mappingFromApi, setMappingFromApi] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const handleRowClick = (balanceteId: number) => {
    const basePath = location.pathname.replace(
      /\/arquivos\/upload\/balancete$/,
      "",
    );
    navigate(`${basePath}/balancetes/${balanceteId}`);
  };

  const handleDeleteBalancete = async (id: number) => {
    setLoading(true, "Excluindo balancete...");
    try {
      const response = await deleteBalancete(id);
      if (response?.success === true) {
        toast.success("Balancete excluído com sucesso!");
        setBalanceteList((prev) => ({
          ...prev,
          balancetes: prev.balancetes.filter((item) => item.id !== id),
        }));
      } else {
        toast.error("Erro ao excluir o balancete.");
      }
    } catch (error) {
      toast.error("Erro ao excluir o balancete.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalancetes = async () => {
    setLoading(true, "Buscando balancetes...");
    try {
      if (!accountPlanId) return;
      const response = await getBalancetes(accountPlanId, getFinancialScope());
      if (response?.success === false) {
        toast.error(
          `Erro ao buscar os balancetes, entre em contato com o suporte.`,
        );
        return;
      }
      setBalanceteList(response.data);
    } catch (error) {
      toast.error(
        `Erro ao buscar os balancetes, entre em contato com o suporte.`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchBalancetes();
    } else {
      setBalanceteList({ id: 0, balancetes: [] });
    }
  }, [accountPlanId, groupId, companyid, subCompanyId]);

  const handleMonthChange = (month: number) => {
    setMonth(month);
  };

  const handleYearChange = (year: number) => {
    setYear(year);
  };

  const handleSubmitAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const scope = getFinancialScope();

    if (!scope.groupId || !month || !year) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true, "Verificando configuração do balancete...");

    try {
      const mappingResponse = accountPlanId
        ? await hasBalanceMapping(accountPlanId)
        : null;

      const hasMapping = mappingResponse?.data === true;

      if (!hasMapping) {
        navigate(`${basePath}/colunas`, {
          state: {
            file,
            accountPlanId,
            groupId: scope.groupId,
            companyId: scope.companyId,
            subCompanyId: scope.subCompanyId,
            month,
            year,
          },
        });
        return;
      }

      const payload: BalancetePayload = {
        accountPlansId: accountPlanId ?? undefined,
        groupId: scope.groupId,
        companyId: scope.companyId,
        subCompanyId: scope.subCompanyId,
        dateMonth: month,
        dateYear: year,
      };

      setLoading(true, "Enviando dados e arquivo...");

      const response = await submitAccounting(payload);

      if (response?.success) {
        const newBalanceteId = response.data?.id;

        const uploadResponse = await importAccountingWithMapping(file, {
          balanceteId: newBalanceteId,
        });

        if (uploadResponse?.success) {
          toast.success("Arquivo enviado com sucesso!");
          await fetchBalancetes();
        } else {
          toast.error(
            "Erro ao enviar o balancete. Verifique o arquivo e tente novamente.",
          );
        }
      } else {
        const msg =
          response?.data?.message?.trim() || "Erro desconhecido na resposta.";
        const errors = response?.data?.errorMessage;

        if (errors && errors.length > 0) {
          errors.forEach((err: string) => toast.error(err));
        } else {
          toast.error(msg);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar balancete e arquivo:", error);
      toast.error(
        "Erro ao validar ou enviar o balancete. Verifique os dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedBalanceteId(id);
    setOpenDialog(true);
  };

  const handleOpenEditMapping = async () => {
    if (!accountPlanId) return;

    setLoading(true, "Buscando configuração do balancete...");

    try {
      const response = await getBalanceSheetConfig(accountPlanId);

      if (response?.success === false) {
        toast.error("Erro ao buscar configuração do balancete.");
        return;
      }

      setMappingFromApi(response.data);
      setOpenEditModal(true);
    } catch (error) {
      toast.error("Erro ao buscar configuração do balancete.");
    } finally {
      setLoading(false);
    }
  };

  const editMapping = async (payload: any) => {
    if (!accountPlanId) return;

    setSaving(true);
    setLoading(true, "Salvando configuração do balancete...");

    try {
      const response = await editBalanceSheetColumns({
        accountPlanId: accountPlanId,
        startRow: payload.startRow,
        costCenterCol: payload.costCenterCol,
        nameCol: payload.nameCol,
        initialValueCol: payload.initialValueCol,
        debitCol: payload.debitCol,
        creditCol: payload.creditCol,
        finalValueCol: payload.finalValueCol,
        createdAt: new Date().toISOString(),
      });

      if (response?.success) {
        toast.success("Configuração do balancete atualizada com sucesso!");
        setOpenEditModal(false);
      } else {
        toast.error("Erro ao atualizar configuração do balancete.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar configuração do balancete.");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "center",
              flexDirection: "column",
              mt: 2,
            }}
          >
            <Alert severity="info" sx={{ mb: 2 }}>
              Arquivos suportados: .CSV e .XLSX
            </Alert>
            <img
              src={UploadIcon}
              style={{ width: isMobile ? "52px" : "64px" }}
            />
            <Title>Envio do Balancete</Title>
            <Subtitle>Preencha a data do balancete e suba o arquivo.</Subtitle>
          </Box>
          <OptionsContainer>
            <BalanceSheetForm
              selectedMonth={month}
              selectedYear={year}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              onSubmit={handleSubmitAndUpload}
            />
          </OptionsContainer>
        </HeaderContainer>
        <ListContainer>
          <BalanceSheetUploadTable
            data={balanceteList}
            onRowClick={handleRowClick}
            onDelete={handleOpenDeleteDialog}
            hasBalanceSheets={!!balanceteList?.balancetes?.length}
            onEditConfig={handleOpenEditMapping}
          />
        </ListContainer>
        <AlertModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={() => {
            if (selectedBalanceteId) {
              handleDeleteBalancete(selectedBalanceteId);
            }
            setOpenDialog(false);
          }}
          title="Excluir balancete"
          confirmText="Sim, excluir"
          cancelText="Cancelar"
          message={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                gap: "10px",
              }}
            >
              <span style={{ textAlign: "center" }}>
                Tem certeza que deseja excluir este balancete?
              </span>
            </div>
          }
          type="warning"
        />

        <BalanceColumnMappingModal
          open={openEditModal}
          initialData={mappingFromApi}
          loading={saving}
          onClose={() => setOpenEditModal(false)}
          onSubmit={editMapping}
        />
      </MainContainer>
    </MainTemplate>
  );
};

export default UploadBalanceSheet;
