import { useNavigate, useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

import { CompanyForm } from "../GroupForm";
import {
  getCompanies,
  saveCompany,
  updateCompany,
} from "../../services/apis/routes/companies.service";
import { getGroupById } from "../../services/apis/routes/groups.service";
import { getBreadcrumb } from "../../services/apis/routes/breadcrumb.service";

import { useMainContext } from "../../contexts/mainContext";
import { useAuth } from "../../utils/hooks/useAuth";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "react-toastify";

import { GroupFormData } from "../../types/group";
import { Company } from "../../types/company";

import CompanyNavigationDropdown from "../../components/Inputs/CompanyNavigationDropdown";
import { getDropdownNavigation } from "../../services/apis/routes/companies.service";
import { CompanyResponse } from "../../types/companyDropdown";
import { DashboardPage } from "../Dashboard";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ModernTextField } from "../../styles/DatePicker";
import DashboardIcon from "../../assets/icons/duo-icons_dashboard.svg";
import theme from "../../styles/theme";
import dayjs from "dayjs";
import { CompanyMenu } from "../../components/Inputs/CompanyActionsDropdown";

export const Companies = () => {
  const { groupId, companyid } = useParams<{
    groupId: string;
    companyid?: string;
  }>();

  const userData = useAuth();
  const { setLoading } = useLoading();
  const { setBreadcrumbs } = useMainContext();

  const [, setCompaniesData] = useState<Company[]>([]);
  const [, setGroupData] = useState<any>(null);
  const navigate = useNavigate();

  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );

  const [editingCompany, setEditingCompany] = useState<GroupFormData>();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupResponse, companiesResponse] = await Promise.all([
        getGroupById(Number(groupId)),
        getCompanies(Number(groupId)),
      ]);

      setGroupData(groupResponse.data);
      setCompaniesData(companiesResponse.data.companies ?? []);
    } catch {
      toast.error("Erro ao carregar dados das empresas");
    } finally {
      setLoading(false);
    }
  };

  // dropdown navigation
  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao buscar dropdown");
    }
  };

  // breadcrumb
  useEffect(() => {
    const load = async () => {
      if (!groupId) return;

      const items = await getBreadcrumb({
        id: Number(groupId),
        type: "group",
      });

      setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...items]);
    };

    load();
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchData();
      fetchDropdown();
    }
  }, [groupId]);

  const onSubmit = async (data: GroupFormData) => {
    const updatedData = {
      ...data,
      groupId: Number(groupId),
      userId: Number(userData?.userId),
    };

    try {
      setLoading(true, "Salvando empresa...");

      const response = editingCompany
        ? await updateCompany(updatedData, editingCompany.groupId!)
        : await saveCompany(updatedData);

      if (!response.success) {
        toast.error("Erro ao salvar empresa");
        return;
      }

      toast.success("Empresa salva com sucesso!");
      setEditingCompany(undefined);
      setOpen(false);
      fetchData();
    } catch {
      toast.error("Erro ao salvar os dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Box
          sx={{
            display: "flchex",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            ml: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <img src={DashboardIcon} alt="" />
            <Title>Dashboard</Title>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
          {/* Company dropdown */}
          {dropdownData && (
            <Box sx={{ width: "20%", mb: 3 }}>
              <CompanyNavigationDropdown
                data={dropdownData.data}
                selectedId={companyid ? Number(companyid) : Number(groupId)}
                onChange={({ id, type }) => {
                  if (type === "group")
                    return navigate(`/grupos/${id}/empresas`);
                  if (type === "filial")
                    return navigate(
                      `/grupos/${groupId}/empresas/${id}/filiais`
                    );
                  if (type === "sub")
                    return navigate(
                      `/grupos/${groupId}/empresas/${companyid}/filiais/${id}`
                    );
                }}
              />
            </Box>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              label="Ano"
              value={dayjs().year(year)}
              onChange={(v) => setYear(v?.year() ?? year)}
              enableAccessibleFieldDOMStructure={false}
              slots={{
                textField: ModernTextField,
              }}
              slotProps={{
                textField: { size: "medium" },
              }}
            />
          </LocalizationProvider>

          <CompanyMenu
            onAddCompany={() => setOpen(true)}
            onEditCompany={() => {}}
            onInviteMembers={() => console.log("Convidar membros")}
            onDeactivateCompany={() => console.log("Inativar")}
          />
        </Box>

        <DashboardPage year={year} />

        <CompanyForm
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setEditingCompany(undefined);
          }}
          title="Adicionar empresa"
          onSubmit={onSubmit}
          defaultValues={editingCompany}
        />
      </MainContainer>
    </MainTemplate>
  );
};
