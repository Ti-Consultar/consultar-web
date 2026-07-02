import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import UploadIcon from "../../../assets/images/import-file.png";
import { MainTemplate } from "../../../components/AppLayout";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  ImportAccountPlanResponse,
  importAccountPlanAccounts,
} from "../../../services/apis/routes/accountplan.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { buildNestedUrl } from "../../../utils/url/buildNestedUrl";
import { AccountPlanUploadForm } from "./UploadForm";
import {
  ContentContainer,
  HeaderContainer,
  HelperText,
  MainContainer,
  OptionsContainer,
  ResultCard,
  ResultGrid,
  ResultLabel,
  ResultValue,
  SectionTitle,
  Subtitle,
  Title,
} from "./styles";

const UploadAccountPlan = () => {
  useBreadcrumb("upload-account-plan");

  const { groupId, companyid, subCompanyId } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [lastImport, setLastImport] =
    useState<ImportAccountPlanResponse | null>(null);

  const { accountPlanId } = useAccountPlanId({
    groupId,
  });
  const isGroupScope = !companyid && !subCompanyId;

  const isSupportedFile = (file: File) =>
    file.name.toLowerCase().endsWith(".xlsx") ||
    file.name.toLowerCase().endsWith(".csv") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "text/csv" ||
    file.type === "application/csv";

  const newAccountsCount =
    lastImport?.newAccountsCount ?? lastImport?.newAccounts?.length ?? 0;
  const hasNewAccounts =
    newAccountsCount > 0 || !!lastImport?.newAccounts?.length;

  const handleGoToClassification = () => {
    const classificationPath = buildNestedUrl(
      { groupId, companyId: companyid, subCompanyId },
      "classificacao"
    );

    if (classificationPath) {
      navigate(classificationPath);
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!isSupportedFile(file)) {
      toast.error("Envie um arquivo no formato .xlsx ou .csv.");
      return;
    }

    if (!isGroupScope) {
      toast.error("A importação do plano de contas deve ser feita no grupo.");
      return;
    }

    if (!accountPlanId) {
      toast.error("Plano de contas não encontrado para este grupo.");
      return;
    }

    setLoading(true, "Importando plano de contas...");

    try {
      const response = await importAccountPlanAccounts(file, accountPlanId);

      setLastImport(response);
      toast.success(response.message || "Plano de contas importado com sucesso.");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errorMessage?.[0] ||
        "Erro ao importar o plano de contas. Verifique o arquivo e tente novamente.";

      toast.error(apiMessage);
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
            <img
              src={UploadIcon}
              style={{ width: isMobile ? "52px" : "64px" }}
            />
            <Title>Envio do Plano de Contas</Title>
            <Subtitle>
              Suba a planilha do plano de contas para este grupo.
            </Subtitle>
          </Box>
          <OptionsContainer>
            <AccountPlanUploadForm onSubmit={handleUpload} />
          </OptionsContainer>
        </HeaderContainer>

        <ContentContainer>
          <section>
            <SectionTitle>Formato</SectionTitle>
            <HelperText>
              O arquivo deve estar em formato .csv ou .xlsx e conter as contas
              nas duas primeiras colunas.
            </HelperText>
          </section>

          <section>
            <SectionTitle>Última importação</SectionTitle>
            {lastImport ? (
              <>
                <HelperText>{lastImport.message}</HelperText>
                {hasNewAccounts && (
                  <Alert
                    severity="warning"
                    sx={{
                      alignItems: "center",
                      mb: 2,
                    }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleGoToClassification}
                      >
                        Classificar contas
                      </Button>
                    }
                  >
                    {newAccountsCount === 1
                      ? "Uma nova conta foi adicionada e pode precisar de classificação."
                      : `${newAccountsCount} novas contas foram adicionadas e podem precisar de classificação.`}
                  </Alert>
                )}
                <ResultGrid>
                  <ResultCard>
                    <ResultLabel>Importadas</ResultLabel>
                    <ResultValue>
                      {lastImport.importedAccountsCount ?? 0}
                    </ResultValue>
                  </ResultCard>
                  <ResultCard>
                    <ResultLabel>Novas</ResultLabel>
                    <ResultValue>{lastImport.newAccountsCount ?? 0}</ResultValue>
                  </ResultCard>
                  <ResultCard>
                    <ResultLabel>Atualizadas</ResultLabel>
                    <ResultValue>
                      {lastImport.updatedAccountsCount ?? 0}
                    </ResultValue>
                  </ResultCard>
                </ResultGrid>
              </>
            ) : (
              <HelperText>
                O resumo aparecerá aqui depois que o upload for concluído.
              </HelperText>
            )}
          </section>
        </ContentContainer>
      </MainContainer>
    </MainTemplate>
  );
};

export default UploadAccountPlan;
