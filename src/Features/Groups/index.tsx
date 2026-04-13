import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import {
  CardsContainer,
  EmptyStateContainer,
  Greetings,
  GreetingsSubTitle,
  MainContainer,
  NoItems,
} from "./styles";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { CompanyForm } from "../GroupForm";
import { toast } from "sonner";
import {
  deleteGroup,
  getAllGroups,
  getDeletedGroups,
  getGroupById,
  restoreGroups,
  saveGroup,
  updateGroup,
} from "../../services/apis/routes/groups.service";
import { GroupCard } from "../../components/Card";
import { Alert, Box, Grid2, Typography } from "@mui/material";
import { useAuth } from "../../utils/hooks/useAuth";
import { GroupFormData } from "../../types/group";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useMainContext } from "../../contexts/mainContext";
import { useRefresh } from "../../contexts/refreshContext";
import { GroupsHeader } from "./Header";
import { GroupsKPI } from "./GroupsKPI";
import { FilterType, ViewMode } from "../../types/groupViewTypes";

interface UserData {
  exp: number;
  iat: number;
  ip: string;
  role: string;
  unique_name: string;
  userId: string;
}

const Groups = () => {
  const userId = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  const [groupList, setGroupList] = useState<any[]>([]);
  const [deletedGroups, setDeletedGroups] = useState<any[]>([]);
  const [filteredGroupList, setFilteredGroupList] = useState<any[]>([]);

  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");

  const [editingGroup, setEditingGroup] = useState<GroupFormData>();
  const [, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [, setErrors] = useState<{ [key: string]: boolean }>({});
  const [activeStep, setActiveStep] = useState(0);
  const { setBreadcrumbs } = useMainContext();
  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const [groupToBeInvited, setGroupToBeInvited] = useState<number>(0);
  const [notificationsRefreshTimestamp] = useRefresh("companies");

  useEffect(() => {
    setBreadcrumbs([{ name: "Grupos", link: "/grupos" }]);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch {
        toast.error("Sua sessão expirou. Faça login novamente.");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  const fetchGroups = async () => {
    setLoading(true, "Carregando grupos empresariais...");
    try {
      const response = await getAllGroups();
      setGroupList(response.data);
    } catch {
      toast.error("Erro ao buscar os grupos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedroups = async () => {
    try {
      const response = await getDeletedGroups();
      const formatted = response.data.map((item: any) => ({
        id: item.groupId,
        nome: item.businessEntity.nomeFantasia || item.companyName,
        cnpj: item.businessEntity.cnpj,
      }));
      setDeletedGroups(formatted);
    } catch (error) {
      console.error("Erro ao buscar grupos inativos", error);
    }
  };

  useEffect(() => {
    if (userData?.userId) {
      fetchGroups();
    }
    fetchDeletedroups();
    fetchGroups();
  }, [userData, notificationsRefreshTimestamp]);

  // 🔥 LISTA UNIFICADA
  const getCombinedGroups = () => {
    const normalizedActive = groupList.map((item) => ({
      ...item,
      isDeleted: false,
    }));

    const normalizedDeleted = deletedGroups.map((item) => ({
      id: item.id,
      groupName: item.nome,
      businessEntity: {
        nomeFantasia: item.nome,
        razaoSocial: "",
      },
      isDeleted: true,
    }));

    return [...normalizedActive, ...normalizedDeleted];
  };

  useEffect(() => {
    let result = getCombinedGroups();

    if (filter === "active") {
      result = result.filter((g) => !g.isDeleted);
    }

    if (filter === "inactive") {
      result = result.filter((g) => g.isDeleted);
    }

    if (search.trim()) {
      result = result.filter((g) =>
        (g.groupName || "").toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredGroupList(result);
  }, [groupList, deletedGroups, filter, search]);

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleCardClick = (groupId: number) => {
    navigate(`/grupos/${groupId}/empresas`);
  };

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  const greeting = getGreeting();

  const handleEdit = async (id: number) => {
    try {
      setOpen(true);
      const data = await getGroupById(id);
      setEditingGroup(data.data);
    } catch (error) {
      toast.error("Erro ao buscar grupo para edição.");
    }
  };

  const handleOpenInvitationModal = (groupId: number) => {
    setOpenInvitationModal(true);
    setGroupToBeInvited(groupId);
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Box gap={2} display="flex" flexDirection="column">
          <Box>
            <Greetings>
              {greeting}, {userData?.unique_name}
            </Greetings>
            <GreetingsSubTitle>Gerencie suas empresas abaixo</GreetingsSubTitle>
          </Box>

          <GroupsKPI
            total={groupList.length + deletedGroups.length}
            active={groupList.length}
            inactive={deletedGroups.length}
          />

          <GroupsHeader
            onSearchChange={handleSearchChange}
            onAddGroupClick={() => setOpen(true)}
            viewMode={viewMode}
            filter={filter}
            onChangeViewMode={handleViewModeChange}
            onFilterChange={handleFilterChange}
            activeCount={groupList.length}
            inactiveCount={deletedGroups.length}
            total={groupList.length + deletedGroups.length}
          />
        </Box>
      </MainContainer>

      <CardsContainer container spacing={2}>
        {filteredGroupList.map((group) => (
          <Grid2 key={group.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <GroupCard
              fantasyName={
                group.businessEntity?.nomeFantasia || group.groupName
              }
              corporateName={group.businessEntity?.razaoSocial || ""}
              onClick={() => handleCardClick(group.id)}
              onEdit={() => {
                if (group.isDeleted) return;
                handleEdit(group.id);
              }}
              onDelete={() => {
                if (group.isDeleted) return;

                setOpenDialog(true);
                setSelectedGroupId(group.id);
              }}
              onInvite={() => {
                if (group.isDeleted) return;
                handleOpenInvitationModal(group.id);
              }}
            />
          </Grid2>
        ))}
      </CardsContainer>
    </MainTemplate>
  );
};

export default Groups;
