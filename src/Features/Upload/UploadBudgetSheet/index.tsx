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
import { BalancetePayload } from "../../../types/balancetePayload";
import { MainTemplate } from "../../../components/AppLayout";
import { BudgetUploadTable } from "./table";
import { Balancetes } from "../../../types/balancete";
import {
  deleteBudget,
  getBudgets,
  importBudgetSheet,
  submitBudget,
} from "../../../services/apis/routes/budget.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { AlertModal } from "../../../components/AlertModal";

const UploadBudgetSheet = () => {
  useBreadcrumb("upload-budget-sheet");

  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, companyid, subCompanyId } = useParams();
  const { setLoading } = useLoading();
  const [balanceteList, setBalanceteList] = useState<Balancetes>({
    id: 0,
    balancetes: [],
  });
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [balancete, setBalancete] = useState<number>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
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
  const [selectedBalanceteId, setSelectedBalanceteId] = useState<number | null>(
    null
  );

  const handleRowClick = (balanceteId: number) => {
    const basePath = location.pathname.replace(
      /\/arquivos\/upload\/balancete$/,
      ""
    );
    navigate(`${basePath}/balancetes/${balanceteId}`);
  };

  const handleDeleteBalancete = async (id: number) => {
    setLoading(true, "Excluindo orçamento...");
    try {
      const response = await deleteBudget(id);
      if (response?.success === true) {
        toast.success("Orçamento excluído!");
        setBalanceteList((prev) => ({
          ...prev,
          balancetes: prev.balancetes.filter((item) => item.id !== id),
        }));
      } else {
        toast.error("Erro ao excluir o orçamento.");
      }
    } catch (error) {
      toast.error("Erro ao excluir o orçamento.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    setLoading(true, "Buscando orçamentos...");
    try {
      if (!accountPlanId) return;
      const response = await getBudgets(accountPlanId, getFinancialScope());
      if (response?.success === false) {
        toast.error(
          `Erro ao buscar os orçamentos, entre em contato com o suporte.`
        );
        return;
      }
      setBalanceteList(response.data);
    } catch (error) {
      toast.error(
        `Erro ao buscar os orçamentos, entre em contato com o suporte.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchBudgets();
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

  useEffect(() => {}, [balancete]);

  const handleSubmitAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const scope = getFinancialScope();

    if (!scope.groupId || !month || !year) {
      toast.error("Preencha todos os campos obrigatórios.");
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

    try {
      const response = await submitBudget(payload);

      if (response?.success) {
        const newBalanceteId = response.data?.id;
        setBalancete(newBalanceteId);

        const uploadResponse = await importBudgetSheet(file, newBalanceteId);

        if (uploadResponse?.success) {
          toast.success("Arquivo enviado com sucesso!");
          await fetchBudgets();
        } else {
          toast.error(
            "Erro ao enviar o orçamento. Verifique o arquivo e tente novamente."
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
      console.error("Erro ao enviar orçamento e arquivo:", error);
      toast.error(
        "Erro ao enviar o orçamento. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedBalanceteId(id);
    setOpenDialog(true);
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
            <Title>Envio do Orçamento</Title>
            <Subtitle>Preencha a data do orçamento e suba o arquivo.</Subtitle>
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
          <BudgetUploadTable
            data={balanceteList}
            onRowClick={handleRowClick}
            onDelete={handleOpenDeleteDialog}
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
      </MainContainer>
    </MainTemplate>
  );
};

export default UploadBudgetSheet;
