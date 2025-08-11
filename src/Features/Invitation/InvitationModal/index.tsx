import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { MemberCard } from "./MemberInfo";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import { MultiEmailEditableInput } from "./InvitateInput";
import { Member } from "../../../types/member";
import { useParams } from "react-router";
import { invitations } from "../../../types/userInvitationPayload";
import { inviteUser } from "../../../services/apis/routes/invitation.service";
import { toast } from "react-toastify";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Protected } from "../../../components/Protection";
import { usePermission } from "../../../contexts/PermissionsContext";

interface InvitationModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  userPolicies: RoleOption[];
  groupToBeInvited?: number;
  companyId?: number;
  subCompanyId?: number;
}

type RoleOption = {
  id: number;
  name: string;
};

export const InvitationModal = ({
  open,
  onClose,
  members,
  userPolicies,
  companyId,
  subCompanyId,
  groupToBeInvited,
}: InvitationModalProps) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const { groupId } = useParams();
  const { role } = usePermission();

  const sendInvitation = async () => {
    const parsedGroupId =
      groupId !== undefined && !isNaN(Number(groupId))
        ? Number(groupId)
        : undefined;
    const rawGroupId = parsedGroupId ?? groupToBeInvited;

    if (rawGroupId === undefined) {
      console.error("ID do grupo é inválido.");
      return;
    }

    if (emails.length === 0) {
      toast.warning("Por favor, adicione pelo menos um email.");
      return;
    }

    const adjustedSubCompanyId =
      companyId === subCompanyId ? undefined : subCompanyId ?? 0;

    const payload: invitations = {
      invitations: emails.map((email) => ({
        groupId: rawGroupId,
        companyId: companyId,
        subCompanyId: adjustedSubCompanyId,
        emailInvitedByUser: email,
        permissionId: selectedRole,
      })),
    };

    try {
      await toast.promise(
        inviteUser(payload),
        {
          pending: "Enviando convite...",
          success: "Convite enviado",
          error: "Erro ao enviar convite.",
        },
        {
          position: "bottom-center",
          hideProgressBar: true,
          icon: () => <SendRoundedIcon fontSize="medium" />,
        }
      );

      setEmails([]);
      setSelectedRole(1);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error.message ?? "";

      if (
        typeof message === "string" &&
        message.includes("Já existe um Convite")
      ) {
        toast.warning(
          "Um ou mais convites já foram enviados para estes e-mails."
        );
      } else {
        console.error(error);
        toast.error("Erro inesperado ao enviar convite.");
      }
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            minWidth: "50%",
            padding: 1.5,
          },
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            marginBottom={0.5}
            sx={{ color: "var(--neutral-600)" }}
          >
            Membros
          </Typography>
          <CloseRoundedIcon
            onClick={onClose}
            sx={{
              fontSize: "24px",
              cursor: "pointer",
              color: "var(--neutral-500)",
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ color: "var(--neutral-500)" }}>
            {["Admin", "Gestor", "Desenvolvedor", "Consultor"].includes(
              role ?? ""
            )
              ? "Convide novos membros para participar da empresa"
              : "Veja quem está participando dessa empresa."}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Protected
          allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
        >
          <Box>
            <Typography sx={{ color: "var(--neutral-500)" }}>
              Insira os emails
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
            <Box sx={{ width: "80%" }}>
              <MultiEmailEditableInput
                emails={emails}
                onEmailsChange={setEmails}
              />
            </Box>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                width: "20%",
                alignSelf: "flex-start",
                textTransform: "none",
                border: "none",
                fontWeight: 600,
                backgroundColor: "#F9B20F",
                color: "var(--neutral-700)",
              }}
              onClick={sendInvitation}
            >
              Convidar
            </Button>
          </Box>
          <Box sx={{ gap: 2, alignItems: "center", display: "flex", mt: 1 }}>
            <span>Os usuários acima terão a permissão de: </span>
            <Select
              size="small"
              value={selectedRole}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
              sx={{ minWidth: 120 }}
            >
              {(userPolicies ?? []).length > 0 ? (
                userPolicies.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Nenhuma permissão disponível
                </MenuItem>
              )}
            </Select>
          </Box>
        </Protected>
        <Box sx={{ gap: 2, alignItems: "center", mt: 3 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            marginBottom={0.5}
            sx={{ color: "var(--neutral-500)", fontSize: "16px" }}
          >
            Nesta empresa
          </Typography>
          {Array.isArray(members) && members.length > 0 ? (
            members.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                email={member.email}
                role={member.permission.name}
                roles={userPolicies}
                isCurrentUser={member.userLogado}
                onRoleChange={(newRole) => console.log("Novo papel:", newRole)}
              />
            ))
          ) : (
            <p>Nenhum membro encontrado.</p>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
