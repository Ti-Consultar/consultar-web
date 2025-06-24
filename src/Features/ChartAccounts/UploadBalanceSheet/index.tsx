import { useEffect, useState } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import {
  FileSearchImg,
  HeaderContainer,
  MainContainer,
  Subtitle,
  Title,
  UploadContainer,
} from "./styles";
import FileSearch from "../../../assets/icons/mage_file-upload.svg";
import { BalanceSheetForm } from "./BalanceSheetForm";
import { Alert, Box, SelectChangeEvent } from "@mui/material";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  importAccounting,
  submitAccounting,
} from "../../../services/apis/routes/balancete.service";
import { BalancetePayload } from "../../../types/balancetePayload";
import { useLoading } from "../../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export const UploadBalanceSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { groupId, companyid, subCompanyId } = useParams();
  const [accountPlanId, setAccountPlanId] = useState<number>();
  const [balancete, setBalancete] = useState<number>();
  const [entityName, setEntityName] = useState<number>();
  const { setLoading } = useLoading();

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setMonth(Number(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
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

          if (lastItem?.subCompany?.id) {
            setEntityName(lastItem.subCompany.name);
          } else if (lastItem?.company?.id) {
            setEntityName(lastItem.company.name);
          } else if (lastItem?.group?.id) {
            setEntityName(lastItem.group.name);
          }

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

  const handleSubmit = async () => {
    if (!accountPlanId || !month || !year) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload: BalancetePayload = {
      accountPlansId: accountPlanId,
      dateMonth: month,
      dateYear: year,
    };

    setLoading(true, "Preparando para subir o arquivo...");

    try {
      const response = await submitAccounting(payload);

      if (response?.success) {
        const newPath = `${location.pathname}/${response?.data?.id}/upload`;
        setBalancete(response?.data?.id);

        navigate(newPath);
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
    } catch (error: any) {
      console.error("Erro ao submeter balancete:", error);
      toast.error("Erro ao enviar o balancete. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [balancete]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true, "Enviando arquivo...");
    try {
      if (!balancete) return;
      const response = await importAccounting(file, balancete);
      if (response?.success) {
        toast.success("Arquivo enviado com sucesso!");
      } else {
        toast.error("Erro ao enviar o balancete. Verifique o arquivo e tente novamente");
      }
    } catch (error) {
      console.error("Erro ao fazer upload do balancete:", error);
      toast.error(
        "Erro ao enviar o balancete. Verifique o arquivo e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CloudUploadOutlinedIcon />
            <Title>Upload Balancete</Title>
          </Box>
          <Subtitle>{entityName}</Subtitle>
        </HeaderContainer>
        <UploadContainer>
          <Alert severity="info" sx={{ mb: 2 }}>
            Arquivos suportados: .CSV e .XLSX
          </Alert>
          <FileSearchImg src={FileSearch} alt="Ícone upload" />
          <Title>Comece subindo um balancete</Title>
          <Subtitle>
            Selecione o mês e o ano referente ao balancete e suba o arquivo .csv
            ou .xlsx.
          </Subtitle>
          <BalanceSheetForm
            selectedMonth={month}
            selectedYear={year}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onSubmit={handleSubmit}
            onUpload={handleUpload}
            onBack={handleBack}
            currentStep={currentStep}
          />
        </UploadContainer>
      </MainContainer>
    </MainTemplate>
  );
};
