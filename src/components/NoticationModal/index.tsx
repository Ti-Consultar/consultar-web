import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Button,
  Box,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import emailIcon from "../../../src/assets/images/e-mail.png";
import { useState } from "react";

type Anchor = "left" | "top" | "right" | "bottom";

interface Invitation {
  id: number;
  group: { id: number; name: string };
  company: { id: number; name: string } | null;
  subCompany: any;
  user: { id: number; name: string; email: string };
  invitedByUser: { id: number; name: string; email: string };
  permission: { id: number; name: string };
  status: string;
  createdAt: string;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Invitation[];
  sentNotifications: Invitation[]; // 🔹 NOVO
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onRemove?: (id: number) => void;
  anchor?: Anchor;
}

export const NotificationDrawer = ({
  open,
  onClose,
  notifications,
  sentNotifications,
  onAccept,
  onReject,
  onRemove,
  anchor = "left",
}: NotificationDrawerProps) => {
  const [tabIndex, setTabIndex] = useState(0); // 🔹 ESTADO ABA

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const renderEmptyState = () => (
    <Box>
      <Box sx={{ width: "100%", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={emailIcon}
            alt="email icon"
            style={{ width: "250px", height: "250px" }}
          />
        </Box>
      </Box>
      <ListItemText
        primary={
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            width="100%"
          >
            Sem notificações {tabIndex === 0 ? "recebidas" : "enviadas"}
          </Typography>
        }
      />
    </Box>
  );

  const renderNotificationItem = (n: Invitation, isReceived: boolean) => (
    <ListItem key={n.id} alignItems="flex-start" divider>
      <ListItemAvatar>
        <Avatar>
          {(isReceived ? n.invitedByUser.name : n.user.name)
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </Avatar>
      </ListItemAvatar>

      <Box sx={{ flexGrow: 1, position: "relative" }}>
        {!isReceived && onRemove && (
          <IconButton
            size="small"
            onClick={() => onRemove(n.id)}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}

        {isReceived && (
          <Typography variant="subtitle2" component="div">
            Convite de {n.invitedByUser.name}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" component="div" sx={{width: '90%'}}>
          {isReceived
            ? `Você foi convidado para ser ${n.permission.name} em ${
                n.company?.name ?? n.group.name
              }.`
            : `Você convidou ${n.user.name} para ser ${
                n.permission.name
              } em ${n.company?.name ?? n.group.name}.`}
        </Typography>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 0.5 }}
          component="div"
        >
          {new Date(n.createdAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>

        {isReceived && onAccept && onReject && (
          <Stack direction="row" spacing={1} mt={1}>
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: "var(--neutral-700)",
                textTransform: "none",
              }}
              onClick={() => onAccept(n.id)}
            >
              Aceitar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => onReject(n.id)}
              sx={{ textTransform: "none" }}
            >
              Rejeitar
            </Button>
          </Stack>
        )}
      </Box>
    </ListItem>
  );

  const currentNotifications =
    tabIndex === 0 ? notifications : sentNotifications;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          mb: 2,
          mt: 2,
          ml: 2,
          borderRadius: 3,
          boxShadow: 6,
          maxHeight: "95vh",
        },
      }}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notificações</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 🔹 TABS */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: "#F4F6F8",
            borderRadius: 2,
            p: 0.5,
            minHeight: "unset",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            label="Recebidas"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minHeight: "unset",
              py: 1,
              transition: "all 0.2s ease",
              color: tabIndex === 0 ? "#fff" : "#555",
              backgroundColor: tabIndex === 0 ? "#FFFFFF" : "#F4F6F8",
              "&:hover": {
                backgroundColor: tabIndex === 0 ? "#FFFFFF" : "#F4F6F8",
              },
            }}
          />
          <Tab
            label="Enviadas"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minHeight: "unset",
              py: 1,
              transition: "all 0.2s ease",
              color: tabIndex === 1 ? "#fff" : "#555",
              backgroundColor: tabIndex === 1 ? "#FFFFFF" : "#F4F6F8",
              "&:hover": {
                backgroundColor: tabIndex === 1 ? "#FFFFFF" : "#F4F6F8",
              },
            }}
          />
        </Tabs>

        <List sx={{ mt: 1 }}>
          {currentNotifications.length === 0
            ? renderEmptyState()
            : currentNotifications.map((n) =>
                renderNotificationItem(n, tabIndex === 0)
              )}
        </List>
      </Box>
    </Drawer>
  );
};
