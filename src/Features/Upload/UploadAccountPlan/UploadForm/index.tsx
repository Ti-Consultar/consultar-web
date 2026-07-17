import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CompanyNavigationDropdown from "../../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../../services/apis/routes/companies.service";
import { useNavigate, useParams } from "react-router";
import { FormContainer, MainContainer } from "./styles";

interface AccountPlanUploadFormProps {
  hasAccountPlan: boolean;
  isReplacement: boolean;
  onDeleteClick: () => void;
  onUploadClick: () => void;
}

export const AccountPlanUploadForm = ({
  hasAccountPlan,
  isReplacement,
  onDeleteClick,
  onUploadClick,
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
          <Box sx={{ width: { xs: "100%", sm: 320 }, minWidth: 0 }}>
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

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "stretch", sm: "flex-end" },
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {hasAccountPlan && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={onDeleteClick}
              sx={{ whiteSpace: "nowrap", textTransform: "none" }}
            >
              Excluir plano de contas
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={
              isReplacement ? (
                <ChangeCircleOutlinedIcon />
              ) : (
                <BackupOutlinedIcon />
              )
            }
            color={isReplacement ? "warning" : "primary"}
            onClick={onUploadClick}
            sx={{
              whiteSpace: "nowrap",
              textTransform: "none",
              ...(isReplacement && {
                color: "var(--neutral-800)",
                bgcolor: "var(--status-warning-500)",
                "&:hover": { bgcolor: "#DC9000" },
              }),
            }}
          >
            {isReplacement
              ? "Substituir Plano de Contas"
              : "Subir plano de contas"}
          </Button>
        </Box>
      </FormContainer>
    </MainContainer>
  );
};
