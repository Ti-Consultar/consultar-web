import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as XLSX from "xlsx";

import { MainTemplate } from "../../../components/AppLayout";
import { SpreadsheetTable } from "./SpreadsheetTable";
import { SpreadsheetData } from "./SpreadsheetTable";
import {
  FormContainer,
  SpreadsheetContainer,
  Title,
  MainContainer,
  Title2,
} from "./styles";
import { parseSheet } from "../../../utils/parsers/parseSheet";
import { Box } from "@mui/material";
import { BalanceColumnForm } from "./BalanceColumnForm";
import {
  submitAccounting,
  importAccountingWithMapping,
} from "../../../services/apis/routes/balancete.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { toast } from "sonner";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";

const PREVIEW_ROWS_LIMIT = 150;

const BalanceColumnMapping = () => {
  useBreadcrumb("balance-column-mapping");

  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const { file, accountPlanId, groupId, companyId, subCompanyId, month, year } =
    location.state || {};

  const [spreadsheetData, setSpreadsheetData] =
    useState<SpreadsheetData | null>(null);

  useEffect(() => {
    if (!file || !groupId || !month || !year) {
      navigate(-1);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsed = parseSheet(sheet);

      setSpreadsheetData({
        ...parsed,
        rows: parsed.rows.slice(0, PREVIEW_ROWS_LIMIT),
      });
    };

    reader.readAsArrayBuffer(file);
  }, [file, groupId, month, year, navigate]);

  const handleSubmitMapping = async (mappingPayload: any) => {
    if (!file || !groupId || !month || !year) return;

    setLoading(true, "Salvando configuração e enviando balancete...");

    try {
      const createResponse = await submitAccounting({
        accountPlansId: accountPlanId ?? undefined,
        groupId,
        companyId,
        subCompanyId,
        dateMonth: month,
        dateYear: year,
      });

      if (!createResponse?.success) {
        toast.error("Erro ao criar o balancete.");
        return;
      }

      const balanceteId = createResponse.data?.id;

      const uploadResponse = await importAccountingWithMapping(file, {
        balanceteId,
        startRow: mappingPayload.startRow,
        costCenter: mappingPayload.costCenterCol,
        name: mappingPayload.nameCol,
        initialValue: mappingPayload.initialValueCol,
        debit: mappingPayload.debitCol,
        credit: mappingPayload.creditCol,
        finalValue: mappingPayload.finalValueCol,
      });

      if (uploadResponse?.success) {
        toast.success("Balancete configurado e enviado com sucesso!");
        navigate(-1);
      } else {
        toast.error("Erro ao enviar o balancete configurado.");
      }
    } catch (error) {
      toast.error("Erro ao processar o balancete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Mapeamento do Balancete</Title>
        <Title2>
          Defina em quais colunas da planilha estão as informações
          correspondentes do balancete.
        </Title2>

        <Box sx={{ display: "flex", gap: "16px" }}>
          <SpreadsheetContainer>
            {spreadsheetData && <SpreadsheetTable data={spreadsheetData} />}
          </SpreadsheetContainer>

          <FormContainer>
            <BalanceColumnForm onSubmit={handleSubmitMapping} />
          </FormContainer>
        </Box>
      </MainContainer>
    </MainTemplate>
  );
};

export default BalanceColumnMapping;
