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
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

/* ÍCONES */
import HomeIcon from "../../../assets/icons/sidebarv2/mrp-home.svg";
import HomeIconFilled from "../../../assets/icons/sidebarv2/mrp-home-filled.svg";

import DashboardIcon from "../../../assets/icons/sidebarv2/mrp-dashboard.svg";
import DashboardIconFilled from "../../../assets/icons/sidebarv2/mrp-dashboard-filled.svg";

import BalanceFile from "../../../assets/icons/sidebarv2/mrp-file.svg";
import BalanceFileFilled from "../../../assets/icons/sidebarv2/mrp-file-filled.svg";

import ClassificationIcon from "../../../assets/icons/sidebarv2/mrp-link.svg";
import ClassificationIconFilled from "../../../assets/icons/sidebarv2/mrp-link-filled.svg";

import FluxoIcon from "../../../assets/icons/sidebarv2/mrp-cashflow.svg";
import FluxoIconFilled from "../../../assets/icons/sidebarv2/mrp-cashflow-filled.svg";

import ParamsIcon from "../../../assets/icons/sidebarv2/mrp-gear.svg";
import ParamsIconFilled from "../../../assets/icons/sidebarv2/mrp-gear-filled.svg";

import ValueTreeIcon from "../../../assets/icons/sidebarv2/mrp-flow.svg";
import ValueTreeIconFilled from "../../../assets/icons/sidebarv2/mrp-flow-filled.svg";

import UploadIcon from "../../../assets/icons/sidebarv2/mrp-file-upload.svg";
import UploadIconFilled from "../../../assets/icons/sidebarv2/mrp-file-upload-filled.svg";

import BarChartIcon from "../../../assets/icons/sidebarv2/mrp-chart-bar.svg";
import BarChartIconFilled from "../../../assets/icons/sidebarv2/mrp-chart-bar-filled.svg";

import SidebarClose from "../../../assets/icons/sidebar/sidebar-close.svg";
import SidebarOpen from "../../../assets/icons/sidebar/sidebar-active.svg";
import SidebarHover from "../../../assets/icons/sidebar/sidebar-closed.svg";

import logoConsultar from "../../../../src/assets/icons/logo_horizontal 1.svg";

/* Contexts */
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
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */
interface SidebarSubItem {
  title: string;
  path?: string | null;
  allowedRoles?: Role[];
}

interface SidebarItem {
  title: string;
  icon: {
    default: string;
    filled: string;
  };
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

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */
export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : true;
  });

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [hoverToggle, setHoverToggle] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null | undefined>();

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const { toggleDrawer } = useDrawer();
  const { logout } = useAuth();

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

  const hasParams = !!params.groupId;

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */
  const isActive = (path?: string | null) =>
    path ? location.pathname === path : false;

  const isParentActive = (item: SidebarItem) =>
    item.subItems?.some((s) => isActive(s.path)) ?? false;

  const toggleExpand = (title: string) =>
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));

  useEffect(() => {
    if (drawerOpen) loadNotifications();
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

  /* -------------------------------------------------------
     SIDEBAR CONFIG
  ------------------------------------------------------- */
  const sidebarSections: SidebarSection[] = [
    {
      title: "Menu",
      items: [
        {
          title: "Início",
          icon: { default: HomeIcon, filled: HomeIconFilled },
          path: "/grupos",
        },

        ...(hasParams
          ? [
              {
                title: "Dashboard",
                icon: { default: DashboardIcon, filled: DashboardIconFilled },
                path: buildNestedUrl(params, "empresas"),
              },
              {
                title: "Uploads",
                icon: { default: UploadIcon, filled: UploadIconFilled },
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
                icon: { default: BalanceFile, filled: BalanceFileFilled },
                subItems: [
                  {
                    title: "Balanço Contábil",
                    path: buildNestedUrl(params, "contabil"),
                  },
                  {
                    title: "Demonstrações Contábeis",
                    path: buildNestedUrl(params, "demonstracoes-contabeis"),
                  },
                  {
                    title: "Demonstrações por Marca",
                    path: buildNestedUrl(params, "demonstracoes-marcas"),
                  },
                ],
              },
              {
                title: "Resultados",
                icon: { default: BarChartIcon, filled: BarChartIconFilled },
                subItems: [
                  {
                    title: "Gestão de Liquidez",
                    path: buildNestedUrl(params, "resultados/gestao-liquidez"),
                  },
                  {
                    title: "Índices Econômicos",
                    path: buildNestedUrl(
                      params,
                      "resultados/indices-economicos",
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
                      "resultados/eficiencia-operacional",
                    ),
                  },
                ],
              },
              {
                title: "Fluxo de Caixa",
                icon: { default: FluxoIcon, filled: FluxoIconFilled },
                path: buildNestedUrl(params, "fluxo-caixa"),
              },
              {
                title: "Árvore de Valor",
                icon: { default: ValueTreeIcon, filled: ValueTreeIconFilled },
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
                icon: {
                  default: ClassificationIcon,
                  filled: ClassificationIconFilled,
                },
                path: buildNestedUrl(params, "classificacao"),
              },
              {
                title: "Parametrização",
                icon: { default: ParamsIcon, filled: ParamsIconFilled },
                path: buildNestedUrl(params, "parametros"),
              },
            ],
          },
        ]
      : []),
  ];

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
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
          onMouseEnter={() => setHoverToggle(true)}
          onMouseLeave={() => setHoverToggle(false)}
          sx={{ width: 28, height: 28, mt: 1 }}
        >
          <img
            src={
              collapsed
                ? hoverToggle
                  ? SidebarHover
                  : SidebarOpen
                : SidebarClose
            }
            style={{
              width: "28px",
              transition:
                "opacity .2s ease, transform .25s cubic-bezier(.175,.885,.32,1.275)",
              opacity: hoverToggle ? 0.9 : 1,
              transform: hoverToggle ? "scale(1.08)" : "scale(1)",
            }}
          />
        </IconButton>
      </div>

      {/* SEÇÕES */}
      {sidebarSections.map((section) => {
        const content = (
          <>
            <SectionTitle collapsed={collapsed}>{section.title}</SectionTitle>

            <StyledList dense>
              {section.items.map((item) => {
                const activeSimple = isActive(item.path);
                const activeParent = isParentActive(item);

                const iconToShow = activeSimple
                  ? item.icon.filled
                  : item.icon.default;

                const parentIcon = activeParent
                  ? item.icon.filled
                  : item.icon.default;

                const ItemContent = (
                  <>
                    {/* Item simples */}
                    {!item.subItems && item.path && (
                      <Tooltip
                        title={collapsed ? item.title : ""}
                        placement="right"
                      >
                        <ListItemButton
                          selected={activeSimple}
                          onClick={() => navigate(item.path!)}
                          sx={{
                            mx: collapsed ? 0.5 : 1,
                            borderRadius: "8px",

                            "&.Mui-selected": {
                              backgroundColor: "#EEEEEE !important",
                            },

                            "&.Mui-selected:hover": {
                              backgroundColor: "#e6e3e3ff !important",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                            <img
                              src={iconToShow}
                              width={20}
                              height={20}
                              alt=""
                              style={{ transition: "0.2s" }}
                            />
                          </ListItemIcon>

                          {!collapsed && <ListItemText primary={item.title} />}
                        </ListItemButton>
                      </Tooltip>
                    )}

                    {/* Item com subitens */}
                    {item.subItems &&
                      (() => {
                        const headerButton = (
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
                            sx={{
                              mx: collapsed ? 0.5 : 1,
                              borderRadius: "8px",
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                              <img
                                src={parentIcon}
                                width={20}
                                height={20}
                                alt=""
                                style={{ transition: "0.2s" }}
                              />
                            </ListItemIcon>

                            {!collapsed && (
                              <ListItemText primary={item.title} />
                            )}

                            {!collapsed &&
                              (expandedItems[item.title] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              ))}
                          </ListItemButton>
                        );

                        return (
                          <div>
                            {collapsed ? (
                              <Tooltip title={item.title} placement="right">
                                <span>{headerButton}</span>
                              </Tooltip>
                            ) : (
                              headerButton
                            )}

                            {/* SUBITEMS */}
                            <Collapse
                              in={!collapsed && !!expandedItems[item.title]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List disablePadding>
                                {item.subItems.map((sub) => {
                                  const subActive = isActive(sub.path);

                                  return (
                                    <ListItemButton
                                      key={sub.title}
                                      sx={{
                                        pl: 4,
                                        borderRadius: "8px",
                                      }}
                                      selected={subActive}
                                      onClick={() =>
                                        sub.path && navigate(sub.path)
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
                                })}
                              </List>
                            </Collapse>
                          </div>
                        );
                      })()}
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

        {userData && (
          <ListItemButton
            onClick={(e) =>
              setMenuState({ anchorEl: e.currentTarget, menuType: "perfil" })
            }
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
