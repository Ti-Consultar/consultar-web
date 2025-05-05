import { useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { useEffect, useState } from "react";
import {
  deleteCompany,
  getCompanies,
  restoreCompanies,
  saveCompany,
} from "../../services/apis/routes/companies.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import { CompanyTable } from "./CompanyTable";
import { Company } from "../../types/company";
import { HeaderContainer, MainContainer } from "./styles";
import { DivSkeleton } from "../../styles/skeleton/skeleton";
import { getGroupById } from "../../services/apis/routes/groups.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { InfoCard } from "./InfoCard";
import { GroupFormData } from "../../types/group";
import { formatPhoneNumberSymbolized } from "../../utils/formatters";
import { CompanyForm } from "../GroupForm";
import { useMediaQuery } from "@mui/material";
import { MobileTableView } from "./MobileTableView";

type Companies = {
  groupName: string;
  companies: Company[];
};

export const Companies = () => {
  const { groupId } = useParams();
  const [companiesData, setCompaniesData] = useState<Companies | null>(null);
  const [groupData, setGroupData] = useState<GroupFormData>(
    {} as GroupFormData
  );
  const { setLoading } = useLoading();
  const userData = useAuth();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [editingCompany, setEditingCompany] = useState<GroupFormData>();
  const [deletedCompanies, setDeletedCompanies] = useState<any[]>([]);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const fetchAllData = async () => {
    try {
      const [groupResponse, companiesResponse] = await Promise.all([
        getGroupById(Number(groupId), Number(userData?.userId)),
        getCompanies(Number(groupId)),
      ]);

      setGroupData(groupResponse.data);
      setCompaniesData(companiesResponse.data);
    } catch (error) {
      toast.error("Erro ao buscar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && groupId) {
      fetchAllData();
    }
  }, [userData, groupId]);

  const onSubmit = async (data: GroupFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(data.businessEntity.email);

    if (!isValidEmail) {
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    setLoading(true, "Salvando empresa...");

    try {
      const updatedData = {
        ...data,
        groupId: groupData.groupId,
      };

      const response = await saveCompany(updatedData);

      if (
        response.success &&
        typeof response.data === "string" &&
        response.data.includes("Já existe um cadastro com este CNPJ")
      ) {
        setErrors((prev) => ({ ...prev, cnpj: true }));
        toast.warning("Já existe um cadastro com este CNPJ.");
        return;
      }

      if (!response.success) {
        setError("Um erro ocorreu ao tentar salvar o Grupo");
        return;
      }

      setError(null);
      setActiveStep(0);
      setOpen(false);
      toast.dismiss();

      setTimeout(() => {
        const message = editingCompany?.groupId
          ? "Grupo atualizado com sucesso!"
          : "Empresa criada com sucesso!";

        toast.success(message);
      }, 500);

      setEditingCompany(undefined);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Erro ao salvar os dados da empresa.");
      }
    } finally {
      fetchAllData();
      setLoading(false);
    }
  };

  const handleReactivate = async (selectedIds: number[]) => {
    try {
      setLoading(true, "Reativando empresas...");
      await restoreCompanies(
        Number(userData?.userId),
        Number(groupId),
        selectedIds
      );
      const updated = deletedCompanies.filter(
        (c) => !selectedIds.includes(c.id)
      );
      setDeletedCompanies(updated);
      toast.success("Empresas reativadas com sucesso!");
      fetchAllData();
    } catch (error) {
      toast.error("Erro ao reativar empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (company: Company) => {
    try {
      setLoading(true, "Excluindo empresa...");

      const response = await deleteCompany(
        company.companyId,
        Number(groupId),
        Number(userData?.userId)
      );

      if (!response.success) {
        toast.error("Um erro ocorreu ao tentar excluir a empresa");
        return;
      }

      toast.success("Empresa excluída com sucesso!");
      setCompaniesData((prev) =>
        prev
          ? {
              ...prev,
              companies: prev.companies.filter(
                (c) => c.companyId !== company.companyId
              ),
            }
          : null
      );
    } catch (error) {
      toast.error("Erro ao excluir a empresa.");
    } finally {
      setLoading(false);
    }
  };

  if (!companiesData) {
    return (
      <MainTemplate>
        <MainContainer>
          {isMobile ? (
            <>
              <DivSkeleton width="95%" height="100px" />
              <DivSkeleton width="95%" height="600px" />
            </>
          ) : (
            <>
              <DivSkeleton width="95%" height="120px" />
              <DivSkeleton width="95%" height="400px" />
            </>
          )}
        </MainContainer>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <CompanyForm
            isOpen={open}
            onClose={() => setOpen(false)}
            onSuccess={() => {}}
            title="Adicionar empresa"
            onSubmit={onSubmit}
          />
          <InfoCard
            title={companiesData.groupName}
            email={groupData.businessEntity.email}
            phones={formatPhoneNumberSymbolized(
              groupData.businessEntity.telefone
            )}
          />
        </HeaderContainer>
        {isMobile ? (
          <MobileTableView
            companies={companiesData.companies}
            onMoreClick={() => {}}
            onAddClick={() => setOpen(true)}
            onAddCompany={() => setOpen(true)}
            onEdit={() => {}}
            onDelete={handleDeleteCompany}
            onReactivate={handleReactivate}
            fileName={groupData.businessEntity.razaoSocial}
            onOpen={() => {}}
          ></MobileTableView>
        ) : (
          <CompanyTable
            onDelete={handleDeleteCompany}
            onEdit={() => {}}
            onOpen={() => {}}
            fileName={groupData.businessEntity.razaoSocial}
            companies={companiesData.companies}
            onReactivate={handleReactivate}
            onAddCompany={() => setOpen(true)}
          />
        )}
      </MainContainer>
    </MainTemplate>
  );
};
