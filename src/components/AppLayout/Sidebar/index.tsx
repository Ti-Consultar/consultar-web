import { SidebarContainer, Header, ButtonDrawer, ListNavItem, NavItem, Icon, Title, ProfileItem } from "./styles"

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import logoConsultar from '../../../../src/assets/icons/logo-consultar.svg';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMainContext } from "../../../contexts/mainContext";

import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { Menu, MenuItem } from "@mui/material";
import { useDrawer } from "../../../contexts/SidebarProvider";

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

const drawerListData = [
    {
        title: 'Home',
        path: '/inicio',
        icon: <HomeOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Base Orçamentária',
        path: '/base-orcamentaria',
        icon: <CompareArrowsOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Contas',
        path: '/contas',
        icon: <BarChartOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Balancetes',
        path: '/balancetes',
        icon: <FeedOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DataSaverOffOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Relatórios',
        path: '/relatorios',
        icon: <FileOpenOutlinedIcon fontSize="medium" />,
    },
    {
        title: 'Inserir Balanços',
        path: '/inserir-balancos',
        icon: <AttachMoneyOutlinedIcon fontSize="medium" />,
    },
];

interface DrawerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isOpen }: DrawerProps) => {
    const [userData, setUserData] = useState<UserData | null | undefined>();
    const { isDrawerOpen, toggleDrawer } = useDrawer();

    const [menuState, setMenuState] = useState<{
        anchorEl: HTMLElement | null;
        menuType: 'perfil' | 'companies' | null;
    }>({ anchorEl: null, menuType: null });

    const { navSelected, setNavSelected } = useMainContext();

    const handleNavSelected = (title: string, path: string) => {
        setNavSelected(title);
        navigate(path);
    };

    const handleOpenPerfil = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuState({ anchorEl: event.currentTarget, menuType: 'perfil' });
    };

    const handleClose = () => {
        setMenuState({ anchorEl: null, menuType: null });
      };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');

        setMenuState({ anchorEl: null, menuType: null });

        navigate('/login');
    };

    const navigate = useNavigate();


    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const dataDecoded: UserData = jwtDecode(token);
                setUserData(dataDecoded);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        } else {
            console.log('Couldn\'t find token');
        }
    }, []);

    return (
        <SidebarContainer isOpen={isDrawerOpen}>
            <Header>
                <img src={logoConsultar} alt="Logo Consultar" />{' '}
            </Header>

            <ButtonDrawer onClick={() => { toggleDrawer() }} isOpen={isDrawerOpen}>
                <ArrowForwardIosIcon fontSize="small" sx={{ color: 'white' }} />{' '}
            </ButtonDrawer>

            <ListNavItem>
                <div className="items-main">
                    {drawerListData.map((item) => {
                        return (
                            <NavItem
                                key={item.title}
                                onClick={() => handleNavSelected(item.title, item.path)}
                                selected={navSelected === item.title}
                                isOpen={isDrawerOpen}
                            >
                                <Icon
                                    isOpen={isDrawerOpen}
                                    selected={navSelected === item.title}
                                    className="item-icon"
                                >
                                    {item.icon}
                                </Icon>
                                <Title
                                    isOpen={isDrawerOpen}
                                    className="item-title"
                                    selected={navSelected === item.title}
                                >
                                    {item.title}
                                </Title>
                            </NavItem>
                        );
                    })}
                </div>

                <Menu
                    id="basic-menu"
                    anchorEl={
                        menuState.menuType === 'perfil' ? menuState.anchorEl : null
                    }
                    open={menuState.menuType === 'perfil'}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>Minha conta</MenuItem>
                    <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
                <div className="items-footer">
                    <div className="line-divisor"></div>
                    {userData && (
                        <>
                            <ProfileItem isOpen={isDrawerOpen} onClick={handleOpenPerfil}>
                                <div className="icon-perfil">
                                    <p>{userData.unique_name[0].toUpperCase()} </p>
                                </div>

                                <Title isOpen={isDrawerOpen} className="item-title">
                                    {userData.unique_name}
                                </Title>
                            </ProfileItem>
                        </>
                    )}
                </div>
            </ListNavItem>
        </SidebarContainer>
    )
}