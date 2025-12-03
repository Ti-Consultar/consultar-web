import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { Invite } from "../../types/notificationInvite";
import { useLoading } from "../LoadingProvider";
import { useRefresh } from "../refreshContext";
import { deleteNotification, getSentNotifications, getUserInvitesNotifications } from "../../services/apis/routes/notifications.service";
import { acceptOrDeclineInvite } from "../../services/apis/routes/invitation.service";

interface NotificationContextValue {
  notifications: Invite[];
  sentNotifications: Invite[];
  fetchInvites: () => Promise<void>;
  fetchSent: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  acceptInvite: (id: number) => Promise<void>;
  declineInvite: (id: number) => Promise<void>;
  removeNotification: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Invite[]>([]);
  const [sentNotifications, setSentNotifications] = useState<Invite[]>([]);

  const { setLoading } = useLoading();
  const [, triggerRefreshCompanies] = useRefresh("companies");

  const fetchInvites = useCallback(async () => {
    try {
      const response = await getUserInvitesNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações de convites:", error);
    }
  }, []);

  const fetchSent = useCallback(async () => {
    try {
      const response = await getSentNotifications();
      setSentNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações enviadas:", error);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    await Promise.all([fetchInvites(), fetchSent()]);
  }, [fetchInvites, fetchSent]);

  const acceptInvite = useCallback(
    async (id: number) => {
      try {
        setLoading(true, "Salvando novo usuário");
        const response = await acceptOrDeclineInvite(id, { status: 2 });

        if (response && (response.success || response.sucess)) {
          toast.success("Convite aceito com sucesso.");
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          await fetchInvites();
          triggerRefreshCompanies();
        } else {
          toast.error("Falha ao aceitar o convite.");
        }
      } catch (error) {
        console.error("Erro ao aceitar o convite:", error);
        toast.error("Erro ao aceitar o convite.");
      } finally {
        setLoading(false);
      }
    },
    [fetchInvites, setLoading, triggerRefreshCompanies]
  );

  const declineInvite = useCallback(
    async (id: number) => {
      try {
        setLoading(true, "Recusando convite...");

        const response = await acceptOrDeclineInvite(id, { status: 3 });

        if (response && (response.success || response.sucess) === true) {
          toast.success("Você recusou o convite.");
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          await fetchInvites();
        } else {
          console.warn("Resposta inesperada ao recusar convite:", response);
          toast.error("Falha ao recusar o convite.");
        }
      } catch (error) {
        console.error("Erro ao recusar convite:", error);
        toast.error("Ocorreu um erro ao recusar o convite.");
      } finally {
        setLoading(false);
      }
    },
    [fetchInvites, setLoading]
  );

  const removeNotification = useCallback(
    async (id: number) => {
      try {
        const response = await deleteNotification(id);

        if (response && (response.success || response.sucess) === true) {
          setSentNotifications((prev) => prev.filter((n) => n.id !== id));
          await fetchSent();
        } else {
          toast.error("Falha ao remover a notificação.");
        }
      } catch (error) {
        console.error("Erro ao remover a notificação:", error);
        toast.error("Erro ao remover a notificação.");
      }
    },
    [fetchSent]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sentNotifications,
        fetchInvites,
        fetchSent,
        loadNotifications,
        acceptInvite,
        declineInvite,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};
