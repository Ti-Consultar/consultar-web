import { useLocation } from "react-router-dom";
import {
  SidebarContainer,
  Header,
  ButtonDrawer,
  ListNavItem,
  NavItem,
  Icon,
  Title,
  ProfileItem,
} from "./styles";

import logoConsultar from "../../../../src/assets/icons/logo-consultar.svg";
import logoConsultarHorizontal from "../../../../src/assets/icons/logo_horizontal 1.svg";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMainContext } from "../../../contexts/mainContext";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Menu, MenuItem } from "@mui/material";
import { useDrawer } from "../../../contexts/SidebarProvider";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { NotificationDrawer } from "../../NoticationModal";
import {
  deleteNotification,
  getSentNotifications,
  getUserInvitesNotifications,
} from "../../../services/apis/routes/notifications.service";
import { Invite } from "../../../types/notificationInvite";
import { acceptOrDeclineInvite } from "../../../services/apis/routes/invitation.service";
import { toast } from "react-toastify";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useRefresh } from "../../../contexts/refreshContext";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export interface Company {
  uuid: string;
  name: string;
  sub_companies?: [];
}

interface UserData {
  company_id: number;
  company_name: null;
  company_uuid: null;
  exp: number;
  iat: number;
  ip: string;
  permissions: string[];
  profile: string;
  roles: any[];
  sub_company_id: number;
  sub_company_name: null;
  sub_company_uuid: null;
  unique_name: string;
}

interface Ids {
  groupId?: string | null;
  companyId?: string | null;
  subCompanyId?: string | null;
}

export const Sidebar = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const [userData, setUserData] = useState<UserData | null | undefined>();
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<Invite[]>([]);
  const [sentNotifications, setSentNotifications] = useState<Invite[]>([]);
  const [, triggerRefreshCompanies] = useRefresh("companies");
  const { setLoading } = useLoading();

  const groupIndex = pathParts.indexOf("grupos");
  const groupId = groupIndex !== -1 ? pathParts[groupIndex + 1] : null;

  const companyIndex = pathParts.indexOf("empresas");
  const companyId = companyIndex !== -1 ? pathParts[companyIndex + 1] : null;

  const filialIndex = pathParts.indexOf("filiais");
  const subCompanyId = filialIndex !== -1 ? pathParts[filialIndex + 1] : null;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  type DrawerItem = {
    title: string;
    path?: string;
    icon: React.ReactNode;
    subItems?: {
      title: string;
      path: string;
    }[];
  };

  const drawerListData = [
    {
      title: "Início",
      path: "/grupos",
      icon: <HomeOutlinedIcon fontSize="medium" />,
    } as DrawerItem,
  ];

  const buildUploadBalanceSheetUrl = ({
    groupId,
    companyId,
    subCompanyId,
  }: Ids) => {
    if (groupId && companyId && subCompanyId) {
      return `/grupos/${groupId}/empresas/${companyId}/filiais/${subCompanyId}/plano-de-contas`;
    }
    if (groupId && companyId) {
      return `/grupos/${groupId}/empresas/${companyId}/plano-de-contas`;
    }
    if (groupId) {
      return `/grupos/${groupId}/plano-de-contas`;
    }
    return null;
  };

    const buildBalanceSheetUrl = ({
    groupId,
    companyId,
    subCompanyId,
  }: Ids) => {
    if (groupId && companyId && subCompanyId) {
      return `/grupos/${groupId}/empresas/${companyId}/filiais/${subCompanyId}/balancetes`;
    }
    if (groupId && companyId) {
      return `/grupos/${groupId}/empresas/${companyId}/balancetes`;
    }
    if (groupId) {
      return `/grupos/${groupId}/balancetes`;
    }
    return null;
  };

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const path = buildUploadBalanceSheetUrl({ groupId, companyId, subCompanyId });
  const balancetePath = buildBalanceSheetUrl({ groupId, companyId, subCompanyId });

  if (path && balancetePath) {
    drawerListData.push(
      {
        title: "Uploads",
        icon: <CloudUploadOutlinedIcon fontSize="medium" />,
        subItems: [
          {
            title: "Balancete",
            path,
          },
        ],
      },
      {
        title: "Balancetes",
        icon: <RequestPageOutlinedIcon fontSize="medium" />,
        path: balancetePath
      }
    );
  }

  const fetchUserInvitesNotifications = async () => {
    try {
      const response = await getUserInvitesNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.log("Erro ao buscar notificações de convites:", error);
    }
  };

  const fetchSentNotifications = async () => {
    try {
      const response = await getSentNotifications();
      setSentNotifications(response.data);
    } catch (error) {
      console.log("Erro ao buscar notificações de convites:", error);
    }
  };

  useEffect(() => {
    if (drawerOpen) {
      fetchUserInvitesNotifications();
      fetchSentNotifications();
    }
  }, [drawerOpen]);

  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    menuType: "perfil" | "companies" | null;
  }>({ anchorEl: null, menuType: null });

  const { navSelected, setNavSelected } = useMainContext();
  const nav = useNavigate();

  const handleNavSelected = (title: string, path: string) => {
    setNavSelected(title);
    navigate(path);
  };

  const handleOpenPerfil = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuState({ anchorEl: event.currentTarget, menuType: "perfil" });
  };

  const handleOpenProfile = () => {
    nav(`/perfil/informacoes`);
  };

  const handleClose = () => {
    setMenuState({ anchorEl: null, menuType: null });
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");

    setMenuState({ anchorEl: null, menuType: null });

    navigate("/login");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    } else {
      console.log("Couldn't find token");
      navigate("/login");
    }
  }, []);

  const handleAccept = async (id: number) => {
    try {
      setLoading(true, "Aceitando convite...");
      const response = await acceptOrDeclineInvite(id, { status: 2 });

      if (response && (response.success || response.sucess)) {
        toast.success("Convite aceito com sucesso.");
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
        fetchUserInvitesNotifications();
        triggerRefreshCompanies();
      } else {
        toast.error("Falha ao aceitar o convite.");
      }
    } catch (error) {
      toast.error("Erro ao aceitar o convite.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      setLoading(true, "Recusando convite...");

      const response = await acceptOrDeclineInvite(id, { status: 3 });

      if (response && (response.success || response.sucess) === true) {
        toast.success("Você recusou o convite.");
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
        fetchUserInvitesNotifications();
      } else {
        console.warn("Resposta inesperada:", response);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao recusar o convite.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      const response = await deleteNotification(id);

      if (response && (response.success || response.sucess) === true) {
        setSentNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
        fetchSentNotifications();
      } else {
        toast.error("Falha ao remover a notificação.");
      }
    } catch (error) {
      toast.error("Erro ao remover a notificação.");
    }
  };

  return (
    <SidebarContainer isOpen={isDrawerOpen}>
      <Header>
        {isDrawerOpen ? (
          <img
            src={logoConsultarHorizontal}
            style={{ width: "160px" }}
            alt="Logo Consultar"
          />
        ) : (
          <img src={logoConsultar} alt="Logo Consultar" />
        )}
      </Header>

      <ButtonDrawer
        onClick={() => {
          toggleDrawer();
        }}
        isOpen={isDrawerOpen}
      >
        <ChevronRightRoundedIcon fontSize="small" sx={{ color: "black" }} />{" "}
      </ButtonDrawer>

      <ListNavItem>
        <div className="items-main">
          {drawerListData.map((item) => {
            const isExpanded = expandedItems[item.title] ?? false;

            const hasSubItems = !!item.subItems?.length;

            return (
              <div key={item.title}>
                <NavItem
                  onClick={() => {
                    if (hasSubItems) {
                      if (!isDrawerOpen) {
                        toggleDrawer();
                        setExpandedItems((prev) => ({
                          ...prev,
                          [item.title]: true,
                        }));
                      } else {
                        toggleExpand(item.title);
                      }
                    } else if (item.path) {
                      handleNavSelected(item.title, item.path);
                    }
                  }}
                  selected={navSelected === item.title}
                  isOpen={isDrawerOpen}
                >
                  <Icon
                    isOpen={isDrawerOpen}
                    selected={navSelected === item.title}
                  >
                    {item.icon}
                  </Icon>
                  <Title
                    isOpen={isDrawerOpen}
                    selected={navSelected === item.title}
                  >
                    {item.title}
                  </Title>
                </NavItem>

                {/* SubItems */}
                {hasSubItems && isExpanded && isDrawerOpen && (
                  <div style={{ marginLeft: 32 }}>
                    {item.subItems?.map((sub) => (
                      <NavItem
                        key={sub.title}
                        onClick={() => {
                          handleNavSelected(sub.title, sub.path);
                        }}
                        selected={navSelected === sub.title}
                        isOpen={true}
                      >
                        <Title
                          isOpen={true}
                          selected={navSelected === sub.title}
                        >
                          {sub.title}
                        </Title>
                      </NavItem>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Menu
          id="basic-menu"
          anchorEl={menuState.menuType === "perfil" ? menuState.anchorEl : null}
          open={menuState.menuType === "perfil"}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 3,
              minWidth: 150,
              p: 1,
              bgcolor: "background.paper",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem
            sx={{ display: "flex", gap: 1 }}
            onClick={() => {
              setDrawerOpen(true);
              handleClose();
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: "18px" }} />
            Notificações
          </MenuItem>
          <MenuItem
            sx={{ display: "flex", gap: 1 }}
            onClick={handleOpenProfile}
          >
            <AccountCircleOutlinedIcon sx={{ fontSize: "18px" }} />
            Minha conta
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ display: "flex", gap: 1, borderRadius: "10px" }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: "18px" }} />
            Sair
          </MenuItem>
        </Menu>
        <div className="items-footer">
          <div className="line-divisor"></div>
          {userData && (
            <>
              <ProfileItem isOpen={isDrawerOpen} onClick={handleOpenPerfil}>
                <div className="icon-perfil">
                  <p>{`${userData.unique_name[0].toUpperCase()}${userData.unique_name[1].toUpperCase()}`}</p>
                </div>

                <Title isOpen={isDrawerOpen} className="item-title">
                  {userData.unique_name}
                </Title>
              </ProfileItem>
            </>
          )}
        </div>
      </ListNavItem>
      <NotificationDrawer
        sentNotifications={sentNotifications}
        notifications={notifications}
        open={drawerOpen}
        onRemove={handleRemove}
        onClose={() => setDrawerOpen(false)}
        onAccept={handleAccept}
        onReject={handleDecline}
      />
    </SidebarContainer>
  );
};
