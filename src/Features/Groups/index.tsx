import { useEffect, useMemo, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import {
  CardsContainer,
  Greetings,
  GreetingsSubTitle,
  MainContainer,
} from "./styles";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { CompanyForm } from "../GroupForm";
import { toast } from "sonner";
import { GroupCard } from "../../components/Card";
import { Alert, Box, Grid2 } from "@mui/material";
import { GroupFormData } from "../../types/group";
import { useMainContext } from "../../contexts/mainContext";
import { useRefresh } from "../../contexts/refreshContext";
import { GroupsHeader } from "./Header";
import { GroupsKPI } from "./GroupsKPI";
import { FilterType, ViewMode } from "../../types/groupViewTypes";
import { AlertModal } from "../../components/AlertModal";
import { InvitationModal } from "../Invitation/InvitationModal";

import { useGroups } from "./hooks/useGroup";
import { useGroupActions } from "./hooks/useGroupActions";

import { combineGroups } from "./utils/group.mapper";
import { filterGroups } from "./utils/group.filter";
import { GroupsTable } from "./GroupTable";
import { GroupsEmptyState } from "./EmptyState";
import { getAuthToken } from "../../utils/authToken";

interface UserData {
  exp: number;
  iat: number;
  ip: string;
  role: string;
  unique_name: string;
  userId: string;
}

const Groups = () => {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useMainContext();
  const [notificationsRefreshTimestamp] = useRefresh("companies");

  const [userData, setUserData] = useState<UserData | null>(null);

  const [filter, setFilter] = useState<FilterType>(() => {
    const saved = localStorage.getItem("groups:filterType");
    return (saved as FilterType) || "active";
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("groups:viewMode");
    return (saved as ViewMode) || "grid";
  });
  const [search, setSearch] = useState("");

  const [editingGroup, setEditingGroup] = useState<GroupFormData>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const [groupToBeInvited, setGroupToBeInvited] = useState<number>(0);

  const { groupList, deletedGroups, refetch } = useGroups();

  const {
    handleSubmit,
    handleEdit,
    handleConfirmDelete,
    handleOpenInvite,
    handleReactivate,
  } = useGroupActions({
    refetch,
    setOpen,
    setEditingGroup,
    setOpenDialog,
    setSelectedGroupId,
    setOpenInvitationModal,
    setGroupToBeInvited,
  });

  useEffect(() => {
    setBreadcrumbs([{ name: "Grupos", link: "/grupos" }]);
  }, []);

  useEffect(() => {
    const token = getAuthToken();

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

  useEffect(() => {
    if (userData?.userId) {
      refetch();
    }
  }, [userData, notificationsRefreshTimestamp]);

  const combinedGroups = useMemo(
    () => combineGroups(groupList, deletedGroups),
    [groupList, deletedGroups],
  );

  const filteredGroupList = useMemo(
    () =>
      filterGroups({
        groups: combinedGroups,
        filter,
        search,
      }),
    [combinedGroups, filter, search],
  );

  const handleSearchChange = (query: string) => setSearch(query);
  const handleFilterChange = (value: FilterType) => setFilter(value);
  const handleViewModeChange = (mode: ViewMode) => setViewMode(mode);

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

  useEffect(() => {
    localStorage.setItem("groups:viewMode", viewMode);
    localStorage.setItem("groups:filterType", filter);
  }, [viewMode, filter]);

  return (
    <MainTemplate>
      <InvitationModal
        open={openInvitationModal}
        onClose={() => setOpenInvitationModal(false)}
        groupToBeInvited={groupToBeInvited}
      />

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

      {filteredGroupList.length === 0 ? (
        <GroupsEmptyState filter={filter} search={search} />
      ) : viewMode === "grid" ? (
        <CardsContainer container spacing={2}>
          {filteredGroupList.map((group) => (
            <Grid2 key={group.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <GroupCard
                fantasyName={
                  group.businessEntity?.nomeFantasia || group.groupName
                }
                corporateName={group.businessEntity?.razaoSocial || ""}
                isDeleted={group.isDeleted}
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
                  handleOpenInvite(group.id);
                }}
                onReactivate={() => {
                  if (!group.isDeleted) return;
                  handleReactivate([group.id]);
                }}
              />
            </Grid2>
          ))}
        </CardsContainer>
      ) : (
        <CardsContainer>
          <GroupsTable
            groups={filteredGroupList}
            onClick={handleCardClick}
            onEdit={handleEdit}
            onDelete={(id) => {
              setSelectedGroupId(id);
              setOpenDialog(true);
            }}
            onInvite={handleOpenInvite}
            onReactivate={(id) => handleReactivate([id])}
          />
        </CardsContainer>
      )}

      <CompanyForm
        onSubmit={(data) => handleSubmit(data, editingGroup)}
        externalActiveStep={activeStep}
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditingGroup(undefined);
          setActiveStep(0);
        }}
        defaultValues={editingGroup}
        title="Adicionar Grupo Empresarial"
      />

      <AlertModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => handleConfirmDelete(selectedGroupId)}
        title="Inativar Grupo"
        message={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <span>Deseja inativar este grupo?</span>
            <Alert color="warning" severity="info">
              Esta ação também irá inativar todas as empresas atreladas a ela.
            </Alert>
          </div>
        }
        type="warning"
      />
    </MainTemplate>
  );
};

export default Groups;
