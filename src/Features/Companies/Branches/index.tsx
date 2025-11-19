import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer } from "../styles";

import {
  getBranches,
  saveSubCompany,
  updateSubCompany,
} from "../../../services/apis/routes/subcompanies.service";

import { getCompanyById, getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { CompanyForm } from "../../GroupForm";

import { useLoading } from "../../../contexts/LoadingProvider";
import { useMainContext } from "../../../contexts/mainContext";

import { getBreadcrumb } from "../../../services/apis/routes/breadcrumb.service";
import { GroupFormData } from "../../../types/group";

import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { DashboardPage } from "../../Dashboard";

export const Branches = () => {

  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { setBreadcrumbs } = useMainContext();

  const { groupId, companyId } = useParams<{
    groupId: string;
    companyId: string;
  }>();

  const [, setBranches] = useState<any[]>([]);
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(null);

  const [editingBranch, setEditingBranch] = useState<GroupFormData>();
  const [open, setOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);

  // ============================
  // FETCH BRANCHES
  // ============================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchResponse] = await Promise.all([
        getCompanyById(Number(companyId), Number(groupId)),
        getBranches(Number(companyId)),
      ]);

      setBranches(branchResponse.data ?? []);
    } catch (error) {
      toast.error("Erro ao buscar filiais");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao carregar dropdown");
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!companyId) return;

      const items = await getBreadcrumb({
        id: Number(companyId),
        type: "company",
      });

      const modifiedItems = items.map((item: any) => {
        if (item.type === "group") {
          return { ...item, link: `/grupos/${groupId}/empresas/` };
        }
        return item;
      });

      setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...modifiedItems]);
    };

    load();
  }, [companyId]);

  // ============================
  // ON SUBMIT (FORM)
  // ============================
  const onSubmit = async (data: GroupFormData) => {
    setLoading(true, "Salvando...");

    try {
      const payload = {
        ...data,
        companyId: Number(companyId),
      };

      let response;

      if (editingBranchId) {
        response = await updateSubCompany(payload, editingBranchId);
      } else {
        response = await saveSubCompany(payload);
      }

      if (!response.success) {
        toast.error("Erro ao salvar filial");
        return;
      }

      toast.success(editingBranchId ? "Filial atualizada!" : "Filial criada!");

      setOpen(false);
      setEditingBranch(undefined);
      setEditingBranchId(null);
      fetchData();

    } catch {
      toast.error("Erro ao salvar filial");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // NAVIGATION HANDLER
  // ============================
  const handleNavigation = ({ id, type }: { id: number; type: string }) => {
    const group = Number(groupId);

    if (type === "group") {
      return navigate(`/grupos/${id}/empresas/`);
    }

    if (type === "filial") {
      return navigate(`/grupos/${group}/empresas/${id}/filiais/`);
    }

    if (type === "sub") {
      return navigate(`/grupos/${group}/empresas/${companyId}/filiais/${id}`);
    }
  };

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    if (groupId && companyId) {
      fetchData();
      fetchDropdown();
    }
  }, [groupId, companyId]);

  // ============================
  // RENDER
  // ============================
  return (
    <MainTemplate>
      <MainContainer>

        {/* Dropdown */}
        {dropdownData && (
          <Box sx={{ width: "20%", mb: 3 }}>
            <CompanyNavigationDropdown
              data={dropdownData.data}
              selectedId={Number(companyId)}
              onChange={handleNavigation}
            />
          </Box>
        )}

        {/* DASHBOARD */}
        <DashboardPage />

        {/* FORM */}
        <CompanyForm
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setEditingBranch(undefined);
            setEditingBranchId(null);
          }}
          title="Adicionar Filial"
          onSubmit={onSubmit}
          defaultValues={editingBranch}
        />
      </MainContainer>
    </MainTemplate>
  );
};
