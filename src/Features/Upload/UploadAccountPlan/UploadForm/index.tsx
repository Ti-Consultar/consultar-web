import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import CompanyNavigationDropdown from "../../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../../services/apis/routes/companies.service";
import { useNavigate, useParams } from "react-router";
import { FormContainer, MainContainer } from "./styles";

interface AccountPlanUploadFormProps {
  onSubmit: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AccountPlanUploadForm = ({
  onSubmit,
}: AccountPlanUploadFormProps) => {
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );
  const { groupId, companyid, subCompanyId } = useParams();

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
    if (groupId) {
      fetchDropdown();
    }
  }, [groupId]);

  return (
    <MainContainer>
      <FormContainer>
        {dropdownData && (
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <CompanyNavigationDropdown
              data={dropdownData.data}
              selectedId={
                subCompanyId
                  ? Number(subCompanyId)
                  : companyid
                    ? Number(companyid)
                    : Number(groupId)
              }
              onChange={({ id, type, parentId }) => {
                if (type === "group")
                  return navigate(
                    `/grupos/${id}/arquivos/upload/plano-contas`
                  );
                if (type === "filial")
                  return navigate(
                    `/grupos/${groupId}/empresas/${id}/arquivos/upload/plano-contas`
                  );
                if (type === "sub")
                  return navigate(
                    `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/arquivos/upload/plano-contas`
                  );
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          component="label"
          startIcon={<BackupOutlinedIcon />}
          color="primary"
        >
          Subir plano de contas
          <input
            type="file"
            hidden
            onChange={onSubmit}
            accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx"
          />
        </Button>
      </FormContainer>
    </MainContainer>
  );
};
