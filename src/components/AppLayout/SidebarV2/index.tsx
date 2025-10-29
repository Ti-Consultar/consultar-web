import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  CloudUploadOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

//icons
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import HomeIcon from "../../../assets/icons/sidebar/dashboard.svg";
import DashboardIcon from "../../../assets/icons/duo-icons_dashboard.svg";
import BalanceFile from "../../../assets/icons/sidebar/balanco-dre.svg";
import SidebarOpen from "../../../assets/icons/sidebar/sidebar-open.svg";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SidebarClose from "../../../assets/icons/sidebar/sidebar-close.svg";
import ClassificationIcon from "../../../assets/icons/sidebar/classification.svg";
import FluxoIcon from "../../../assets/icons/sidebar/fluxo-caixa.svg";
import ParamsIcon from "../../../assets/icons/sidebar/params.svg";
import ValueTreeIcon from "../../../assets/icons/sidebar/value-tree.svg";
import logoConsultar from "../../../../src/assets/icons/logo_horizontal 1.svg";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { NotificationDrawer } from "../../NoticationModal";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Invite } from "../../../types/notificationInvite";
import {
  deleteNotification,
  getSentNotifications,
  getUserInvitesNotifications,
} from "../../../services/apis/routes/notifications.service";
import { toast } from "react-toastify";
import { useLoading } from "../../../contexts/LoadingProvider";
import { acceptOrDeclineInvite } from "../../../services/apis/routes/invitation.service";
import { useRefresh } from "../../../contexts/refreshContext";
import { useDrawer } from "../../../contexts/DrawerContext";
import { Protected } from "../../Protection";
import { UserRegisterModal } from "../../Modal/UserRegisterModal";
import { UserRegisterData } from "../../../types/userRegisterPayload";
import { register } from "../../../services/apis/routes/auth.service";
import { Role } from "../../../contexts/PermissionsContext";

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? "64px" : "240px")};
  transition: width 0.3s ease;
  background-color: #fff;
  border-right: 1px solid #eee;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const SectionTitle = styled.div<{ collapsed: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: #888;
  margin: 16px 16px 8px;
  text-transform: uppercase;
  height: 16px; // altura consistente
  visibility: ${({ collapsed }) => (collapsed ? "hidden" : "visible")};
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

interface SidebarSubItem {
  title: string;
  path?: string | null;
  allowedRoles?: Role[];
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path?: string | null;
  subItems?: SidebarSubItem[];
  allowedRoles?: Role[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  allowedRoles?: Role[];
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

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : true;
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const location = useLocation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const params = useParams();
  const [userData, setUserData] = useState<UserData | null | undefined>();
  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    menuType: "perfil" | "companies" | null;
  }>({ anchorEl: null, menuType: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasParams = !!params.groupId;
  const [sentNotifications, setSentNotifications] = useState<Invite[]>([]);
  const [notifications, setNotifications] = useState<Invite[]>([]);
  const [, triggerRefreshCompanies] = useRefresh("companies");
  const { toggleDrawer } = useDrawer();
  const [open, setOpen] = useState(false);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleOpenPerfil = (event: React.MouseEvent<HTMLElement>) => {
    setMenuState({ anchorEl: event.currentTarget, menuType: "perfil" });
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

  const handleOpenProfile = () => {
    navigate(`/perfil/informacoes`);
  };

  const isActive = (path: string) => location.pathname === path;

  type Params = {
    groupId?: string | number;
    companyId?: string | number;
    subCompanyId?: string | number;
  };

  const buildNestedUrl = (
    { groupId, companyId, subCompanyId }: Params,
    finalPath: string
  ): string | null => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    const currentGroupId = groupId || parts[parts.indexOf("grupos") + 1];
    const currentCompanyId =
      companyId ||
      (parts.includes("empresas")
        ? parts[parts.indexOf("empresas") + 1]
        : undefined);
    const currentSubCompanyId =
      subCompanyId ||
      (parts.includes("filiais")
        ? parts[parts.indexOf("filiais") + 1]
        : undefined);

    if (!currentGroupId) return null;

    // Caso especial: Dashboard → sempre vai pro nível da empresa
    if (finalPath === "empresas" || finalPath === "dashboard") {
      if (currentCompanyId) {
        return `/grupos/${currentGroupId}/empresas/${currentCompanyId}/filiais`;
      }
      return `/grupos/${currentGroupId}/empresas`;
    }

    // Lógica padrão
    const isInGroupOnly = !currentCompanyId && !currentSubCompanyId;
    const isInCompany = !!currentCompanyId && !currentSubCompanyId;
    const isInFilial = !!currentSubCompanyId;

    let base = `/grupos/${currentGroupId}`;

    if (isInGroupOnly) {
      // grupo → não inclui /empresas
    } else if (isInCompany) {
      base += `/empresas/${currentCompanyId}`;
    } else if (isInFilial) {
      base += `/empresas/${currentCompanyId}/filiais/${currentSubCompanyId}`;
    }

    return `${base}/${String(finalPath).replace(/^\/+/, "")}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  const handleAccept = async (id: number) => {
    try {
      setLoading(true, "Salvando novo usuário");
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

  const handleSaveNewUser = async (
    data: UserRegisterData
  ): Promise<{ email: string; password: string }> => {
    try {
      setLoading(true, "Cadastrando usuário...");
      const response = await register(data);

      const message =
        typeof response === "string"
          ? response
          : typeof response.data === "string"
          ? response.data
          : response?.data?.message ||
            response?.message ||
            JSON.stringify(response);

      if (
        message?.toLowerCase().includes("sucesso") ||
        message?.toLowerCase().includes("inserido")
      ) {
        toast.success("Usuário cadastrado com sucesso.");
        return { email: data.email, password: data.password };
      } else {
        toast.error("Ocorreu um erro ao cadastrar o usuário.");
        throw new Error(message || "Erro ao cadastrar o usuário");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(
        "Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde."
      );
      throw error;
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

  useEffect(() => {
    if (drawerOpen) {
      fetchUserInvitesNotifications();
      fetchSentNotifications();
    }
  }, [drawerOpen]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);

        const isExpired = dataDecoded.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn("Token expirado");
          Cookies.remove("token");
          navigate("/login");
        } else {
          setUserData(dataDecoded);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        Cookies.remove("token");
        navigate("/login");
      }
    } else {
      console.log("Token não encontrado");
      navigate("/login");
    }
  }, []);

  const sidebarSections: SidebarSection[] = [
    {
      title: "Menu",
      items: [
        {
          title: "Início",
          icon: (
            <img src={HomeIcon} alt="Home" style={{ width: 22, height: 22 }} />
          ),
          path: "/grupos",
        },
        {
          title: "Dashboard",
          icon: (
            <img
              src={DashboardIcon}
              alt="Home"
              style={{ width: 22, height: 22 }}
            />
          ),
          path: buildNestedUrl(params, "empresas"),
        },
        ...(hasParams
          ? [
              {
                title: "Uploads",
                icon: <CloudUploadOutlined />,
                subItems: [
                  {
                    title: "Balancetes",
                    path: buildNestedUrl(params, "arquivos/upload/balancete"),
                  },
                  {
                    title: "Orçamentos",
                    path: buildNestedUrl(params, "arquivos/upload/orcamento"),
                  },
                ],
                allowedRoles: ["Admin", "Desenvolvedor", "Gestor"] as Role[],
              },
              {
                title: "Demonstrações Financeiras",
                icon: (
                  <img
                    src={BalanceFile}
                    alt="Balanço"
                    style={{ width: 22, height: 22 }}
                  />
                ),
                subItems: [
                  {
                    title: "Balanço Contábil",
                    path: buildNestedUrl(params, "contabil"),
                  },
                  {
                    title: "Demonstrações Contábeis",
                    path: buildNestedUrl(params, "demonstracoes-contabeis"),
                  },
                ],
              },
              {
                title: "Resultados",
                icon: <PollOutlinedIcon />,
                subItems: [
                  {
                    title: "Gestão de Liquidez",
                    path: buildNestedUrl(params, "resultados/gestao-liquidez"),
                  },
                  {
                    title: "Índices Econômicos",
                    path: buildNestedUrl(
                      params,
                      "resultados/indices-economicos"
                    ),
                  },
                  {
                    title: "CIL e PFL",
                    path: buildNestedUrl(params, "resultados/cil-ec"),
                  },
                  {
                    title: "Eficiência Operacional",
                    path: buildNestedUrl(
                      params,
                      "resultados/eficiencia-operacional"
                    ),
                  },
                ],
              },
              {
                title: "Fluxo de Caixa",
                icon: (
                  <img
                    src={FluxoIcon}
                    alt="Fluxo"
                    style={{ width: 22, height: 22 }}
                  />
                ),
                path: buildNestedUrl(params, "fluxo-caixa"),
              },
              {
                title: "Árvore de Valor",
                icon: (
                  <img
                    src={ValueTreeIcon}
                    alt="Fluxo"
                    style={{ width: 22, height: 22 }}
                  />
                ),
                path: buildNestedUrl(params, "eva"),
              },
            ]
          : []),
      ],
    },
    ...(hasParams
      ? [
          {
            title: "Administração",
            allowedRoles: ["Admin", "Desenvolvedor", "Gestor"] as Role[],
            items: [
              {
                title: "Classificação",
                icon: (
                  <img
                    src={ClassificationIcon}
                    alt="Classificação"
                    style={{ width: 22, height: 22 }}
                  />
                ),
                path: buildNestedUrl(params, "classificacao"),
              },
              {
                title: "Parametrização",
                icon: (
                  <img
                    src={ParamsIcon}
                    alt="Parametrização"
                    style={{ width: 22, height: 22 }}
                  />
                ),
                path: buildNestedUrl(params, "parametros"),
              },
            ],
          },
        ]
      : []),
  ];

  const handleSubItemClick = (subItemPath: string, parentTitle: string) => {
    if (collapsed) {
      setCollapsed(false);
      setExpandedItems((prev) => ({
        ...prev,
        [parentTitle]: true,
      }));
    }
    navigate(subItemPath);
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <div
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {!collapsed && (
          <img src={logoConsultar} style={{ width: `120px`, height: `50px` }} />
        )}
        <IconButton
          size="small"
          onClick={() => {
            setCollapsed(!collapsed);
            toggleDrawer();
          }}
          sx={{ width: 28, height: 28, mt: 1 }}
        >
          <img src={!collapsed ? SidebarClose : SidebarOpen} />
        </IconButton>
      </div>

      {sidebarSections.map((section) => {
        const SectionContent = (
          <>
            <SectionTitle collapsed={collapsed}>{section.title}</SectionTitle>
            <StyledList dense>
              {section.items.map((item) => {
                const ItemContent = (
                  <>
                    {/* --- Item sem subitens --- */}
                    {!item.subItems && item.path && (
                      <ListItemButton
                        key={item.title}
                        selected={isActive(item.path)}
                        onClick={() => navigate(item.path!)}
                        sx={{ paddingLeft: collapsed ? `30%` : 2 }}
                      >
                        <ListItemIcon sx={{ minWidth: collapsed ? "0px" : 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary={item.title} />}
                      </ListItemButton>
                    )}

                    {/* --- Item com subitens --- */}
                    {item.subItems && (
                      <div key={item.title}>
                        <ListItemButton
                          onClick={() => {
                            if (collapsed) {
                              setCollapsed(false);
                              setExpandedItems((prev) => ({
                                ...prev,
                                [item.title]: true,
                              }));
                            } else {
                              toggleExpand(item.title);
                            }
                          }}
                          sx={{ paddingLeft: collapsed ? `30%` : 2 }}
                        >
                          <ListItemIcon
                            sx={{ minWidth: collapsed ? "0px" : 40 }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {!collapsed && <ListItemText primary={item.title} />}
                          {!collapsed &&
                            (expandedItems[item.title] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            ))}
                        </ListItemButton>

                        <Collapse
                          in={!collapsed && !!expandedItems[item.title]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List disablePadding>
                            {item.subItems
                              .filter((sub) => sub.path)
                              .map((sub) => {
                                const SubContent = (
                                  <ListItemButton
                                    key={sub.title}
                                    sx={{ pl: 4 }}
                                    selected={isActive(sub.path!)}
                                    onClick={() =>
                                      handleSubItemClick(sub.path!, item.title)
                                    }
                                  >
                                    <ListItemText
                                      slotProps={{
                                        primary: {
                                          style: { fontSize: "0.875rem" },
                                        },
                                      }}
                                      primary={sub.title}
                                    />
                                  </ListItemButton>
                                );

                                return sub.allowedRoles ? (
                                  <Protected
                                    key={sub.title}
                                    allowedRoles={sub.allowedRoles}
                                  >
                                    {SubContent}
                                  </Protected>
                                ) : (
                                  SubContent
                                );
                              })}
                          </List>
                        </Collapse>
                      </div>
                    )}
                  </>
                );

                // aplica o Protected no item de nível superior, se tiver allowedRoles
                return item.allowedRoles ? (
                  <Protected key={item.title} allowedRoles={item.allowedRoles}>
                    {ItemContent}
                  </Protected>
                ) : (
                  <div key={item.title}>{ItemContent}</div>
                );
              })}
            </StyledList>
          </>
        );

        // 👇 aplica o Protected para esconder o título da seção e seus itens
        return section.allowedRoles ? (
          <Protected key={section.title} allowedRoles={section.allowedRoles}>
            {SectionContent}
          </Protected>
        ) : (
          <div key={section.title}>{SectionContent}</div>
        );
      })}

      <div style={{ marginTop: "auto", padding: collapsed ? 8 : 16 }}>
        <Divider sx={{ mb: 1 }} />
        {userData && (
          <ListItemButton
            onClick={(event) => handleOpenPerfil(event)}
            sx={{ padding: collapsed ? "7px" : 0 }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                {getInitials(userData.unique_name)}
              </Avatar>
            </ListItemIcon>
            {!collapsed && <ListItemText primary={userData.unique_name} />}
          </ListItemButton>
        )}
      </div>
      <Menu
        id="perfil-menu"
        anchorEl={menuState.menuType === "perfil" ? menuState.anchorEl : null}
        open={menuState.menuType === "perfil"}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "perfil-button",
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 3,
            minWidth: 180,
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
        <Protected
          allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
        >
          <MenuItem
            sx={{ display: "flex", gap: 1 }}
            onClick={() => setOpen(true)}
          >
            <GroupAddOutlinedIcon sx={{ fontSize: "18px" }} />
            Novo Usuário
          </MenuItem>
        </Protected>
        <MenuItem sx={{ display: "flex", gap: 1 }} onClick={handleOpenProfile}>
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
      <NotificationDrawer
        sentNotifications={sentNotifications}
        notifications={notifications}
        open={drawerOpen}
        onRemove={handleRemove}
        onClose={() => setDrawerOpen(false)}
        onAccept={handleAccept}
        onReject={handleDecline}
      />
      <UserRegisterModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSaveNewUser}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
