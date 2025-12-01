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
import { useEffect, useState, ReactNode } from "react";

import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import HomeIcon from "../../../assets/icons/sidebar/dashboard.svg";
import DashboardIcon from "../../../assets/icons/duo-icons_dashboard.svg";
import BalanceFile from "../../../assets/icons/sidebar/balanco-dre.svg";
import SidebarOpen from "../../../assets/icons/sidebar/sidebar-open.svg";
import SidebarClose from "../../../assets/icons/sidebar/sidebar-close.svg";
import ClassificationIcon from "../../../assets/icons/sidebar/classification.svg";
import FluxoIcon from "../../../assets/icons/sidebar/fluxo-caixa.svg";
import ParamsIcon from "../../../assets/icons/sidebar/params.svg";
import ValueTreeIcon from "../../../assets/icons/sidebar/value-tree.svg";
import logoConsultar from "../../../../src/assets/icons/logo_horizontal 1.svg";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { Protected } from "../../Protection";
import { NotificationDrawer } from "../../NoticationModal";

import { Role } from "../../../contexts/PermissionsContext";
import { useDrawer } from "../../../contexts/DrawerContext";

import { getInitials } from "../../../utils/string/getInitials";
import { buildNestedUrl } from "../../../utils/url/buildNestedUrl";
import { useNotifications } from "../../../contexts/NotificationContext/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext/AuthContext";
import { SectionTitle, SidebarContainer, StyledList } from "./styles";


interface SidebarSubItem {
  title: string;
  path?: string | null;
  allowedRoles?: Role[];
}

interface SidebarItem {
  title: string;
  icon: ReactNode;
  path?: string | null;
  subItems?: SidebarSubItem[];
  allowedRoles?: Role[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  allowedRoles?: Role[];
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
  const navigate = useNavigate();
  const params = useParams();

  const { toggleDrawer } = useDrawer();
  const { user, logout } = useAuth();

  const {
    notifications,
    sentNotifications,
    loadNotifications,
    acceptInvite,
    declineInvite,
    removeNotification,
  } = useNotifications();

  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    menuType: "perfil" | null;
  }>({ anchorEl: null, menuType: null });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasParams = !!params.groupId;

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (path: string) => location.pathname === path;

  // Carrega notificações quando Drawer abrir
  useEffect(() => {
    if (drawerOpen) loadNotifications();
  }, [drawerOpen, loadNotifications]);

  const sidebarSections: SidebarSection[] = [
    {
      title: "Menu",
      items: [
        {
          title: "Início",
          icon: <img src={HomeIcon} alt="Home" width={22} height={22} />,
          path: "/grupos",
        },
        ...(hasParams
          ? [
              {
                title: "Dashboard",
                icon: (
                  <img src={DashboardIcon} alt="Home" width={22} height={22} />
                ),
                path: buildNestedUrl(params, "empresas"),
              },
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
                icon: <img src={BalanceFile} width={22} height={22} />,
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
                icon: <img src={FluxoIcon} width={22} height={22} />,
                path: buildNestedUrl(params, "fluxo-caixa"),
              },
              {
                title: "Árvore de Valor",
                icon: <img src={ValueTreeIcon} width={22} height={22} />,
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
                  <img src={ClassificationIcon} width={22} height={22} alt="" />
                ),
                path: buildNestedUrl(params, "classificacao"),
              },
              {
                title: "Parametrização",
                icon: <img src={ParamsIcon} width={22} height={22} alt="" />,
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
      {/* HEADER */}
      <div
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {!collapsed && (
          <img src={logoConsultar} width={120} height={50} alt="Logo" />
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

      {/* SEÇÕES */}
      {sidebarSections.map((section) => {
        const content = (
          <>
            <SectionTitle collapsed={collapsed}>{section.title}</SectionTitle>

            <StyledList dense>
              {section.items.map((item) => {
                const ItemContent = (
                  <>
                    {/* Item simples */}
                    {!item.subItems && item.path && (
                      <ListItemButton
                        selected={isActive(item.path)}
                        onClick={() => navigate(item.path!)}
                        sx={{ paddingLeft: collapsed ? "30%" : 2 }}
                      >
                        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                          {item.icon}
                        </ListItemIcon>

                        {!collapsed && <ListItemText primary={item.title} />}
                      </ListItemButton>
                    )}

                    {/* Item com subitens */}
                    {item.subItems && (
                      <div>
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
                          sx={{ paddingLeft: collapsed ? "30%" : 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
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
                            {item.subItems.map((sub) => {
                              const SubContent = (
                                <ListItemButton
                                  key={sub.title}
                                  sx={{ pl: 4 }}
                                  selected={!!sub.path && isActive(sub.path)}
                                  onClick={() =>
                                    sub.path &&
                                    handleSubItemClick(sub.path, item.title)
                                  }
                                >
                                  <ListItemText
                                    primary={sub.title}
                                    primaryTypographyProps={{
                                      fontSize: "0.875rem",
                                    }}
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
                                <div key={sub.title}>{SubContent}</div>
                              );
                            })}
                          </List>
                        </Collapse>
                      </div>
                    )}
                  </>
                );

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

        return section.allowedRoles ? (
          <Protected key={section.title} allowedRoles={section.allowedRoles}>
            {content}
          </Protected>
        ) : (
          <div key={section.title}>{content}</div>
        );
      })}

      {/* FOOTER */}
      <div style={{ marginTop: "auto", padding: collapsed ? 8 : 16 }}>
        <Divider sx={{ mb: 1 }} />

        {user && (
          <ListItemButton
            onClick={(e) =>
              setMenuState({ anchorEl: e.currentTarget, menuType: "perfil" })
            }
            sx={{ padding: collapsed ? "7px" : 0 }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                {getInitials(user.unique_name)}
              </Avatar>
            </ListItemIcon>

            {!collapsed && <ListItemText primary={user.unique_name} />}
          </ListItemButton>
        )}
      </div>

      {/* MENU PERFIL */}
      <Menu
        id="perfil-menu"
        anchorEl={menuState.anchorEl}
        open={menuState.menuType === "perfil"}
        onClose={() => setMenuState({ anchorEl: null, menuType: null })}
      >
        <MenuItem
          sx={{ display: "flex", gap: 1 }}
          onClick={() => {
            setDrawerOpen(true);
            setMenuState({ anchorEl: null, menuType: null });
          }}
        >
          <NotificationsNoneIcon fontSize="small" />
          Notificações
        </MenuItem>

        <MenuItem
          sx={{ display: "flex", gap: 1 }}
          onClick={() => navigate("/perfil/informacoes")}
        >
          <SettingsOutlinedIcon fontSize="small" />
          Configurações
        </MenuItem>

        <MenuItem sx={{ display: "flex", gap: 1 }} onClick={logout}>
          <LogoutOutlinedIcon fontSize="small" />
          Sair
        </MenuItem>
      </Menu>

      {/* DRAWER NOTIFICAÇÕES */}
      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        sentNotifications={sentNotifications}
        onAccept={acceptInvite}
        onReject={declineInvite}
        onRemove={removeNotification}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
