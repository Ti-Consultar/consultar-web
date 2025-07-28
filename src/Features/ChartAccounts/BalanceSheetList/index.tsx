import { MainTemplate } from "../../../components/AppLayout";
import {
  HeaderContainer,
  ListContainer,
  MainContainer,
  OptionsContainer,
  Subtitle,
  Title,
} from "./styles";
import { Alert, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Balancetes } from "../../../types/balancete";
import { useLocation, useNavigate, useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import UploadIcon from "../../../assets/images/import-file.png";

import {
  deleteBalancete,
  getBalancetes,
  importAccounting,
  submitAccounting,
} from "../../../services/apis/routes/balancete.service";
import { AccountingTable } from "../BalanceSheetList/table";
import { toast } from "react-toastify";
import { BalancetePayload } from "../../../types/balancetePayload";
import { BalanceSheetForm } from "./UploadForm";

export const BalanceSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, companyid, subCompanyId } = useParams();
  const { setLoading } = useLoading();
  const [accountPlanId, setAccountPlanId] = useState<number>();
  const [balanceteList, setBalanceteList] = useState<Balancetes>({
    id: 0,
    balancetes: [],
  });
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [balancete, setBalancete] = useState<number>();

  useEffect(() => {
    const fetchAccountPlan = async () => {
      setLoading(true, "Buscando plano de contas...");
      try {
        if (!groupId) return;
        const response = await getAccountPlan(
          +groupId,
          companyid ? +companyid : undefined,
          subCompanyId ? +subCompanyId : undefined
        );
        setAccountPlanId(response.data[0].id);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchAccountPlan();
  }, []);

  const handleRowClick = (balanceteId: number) => {
    const basePath = location.pathname.replace(
      /\/arquivos\/upload\/balancete$/,
      ""
    );
    navigate(`${basePath}/balancetes/${balanceteId}`);
  };

  const handleDeleteBalancete = async (id: number) => {
    setLoading(true, "Excluindo balancete...");
    try {
      const response = await deleteBalancete(id);
      if (response?.success === true) {
        toast.success("Balancete excluído!");
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
      const response = await getBalancetes(accountPlanId);
      if (response?.success === false) {
        toast.error(
          `Erro ao buscar os balancetes, entre em contato com o suporte.`
        );
        return;
      }
      setBalanceteList(response.data);
    } catch (error) {
      toast.error(
        `Erro ao buscar os balancetes, entre em contato com o suporte.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchBalancetes();
    }
  }, [accountPlanId]);

  const handleMonthChange = (month: number) => {
    setMonth(month);
  };

  const handleYearChange = (year: number) => {
    setYear(year);
  };

  useEffect(() => {
    if (groupId) {
      const getAccountPlanId = async (
        groupId: number,
        companyId?: number,
        subCompanyId?: number
      ): Promise<number | null> => {
        try {
          setLoading(true, "Salvando data...");
          const response = await getAccountPlan(
            groupId,
            companyId,
            subCompanyId
          );

          const data = response.data;

          if (!Array.isArray(data) || data.length === 0) return null;

          const lastItem = data[data.length - 1];

          setAccountPlanId(lastItem.id);
          setLoading(false);

          return null;
        } catch (error) {
          setLoading(false);
          console.error("Failed to fetch AccountPlanId", error);
          throw error;
        }
      };

      getAccountPlanId(
        +groupId,
        companyid ? +companyid : undefined,
        subCompanyId ? +subCompanyId : undefined
      );
    }
  }, [groupId, companyid, subCompanyId]);

  useEffect(() => {}, [balancete]);

  const handleSubmitAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!accountPlanId || !month || !year) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload: BalancetePayload = {
      accountPlansId: accountPlanId,
      dateMonth: month,
      dateYear: year,
    };

    setLoading(true, "Enviando dados e arquivo...");

    try {
      const response = await submitAccounting(payload);

      if (response?.success) {
        const newBalanceteId = response.data?.id;
        setBalancete(newBalanceteId);

        const uploadResponse = await importAccounting(file, newBalanceteId);

        if (uploadResponse?.success) {
          toast.success("Arquivo enviado com sucesso!");
          fetchBalancetes();
        } else {
          toast.error(
            "Erro ao enviar o balancete. Verifique o arquivo e tente novamente."
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
        "Erro ao enviar o balancete. Verifique os dados e tente novamente."
      );
    } finally {
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
            <img src={UploadIcon} style={{ width: "64px" }} />
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
          <AccountingTable
            data={balanceteList}
            onRowClick={handleRowClick}
            onDelete={handleDeleteBalancete}
          />
        </ListContainer>
      </MainContainer>
    </MainTemplate>
  );
};
