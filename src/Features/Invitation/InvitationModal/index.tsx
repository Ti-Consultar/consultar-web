import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { MemberCard } from "./MemberInfo";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useState } from "react";
import { getUserPolicies } from "../../../services/apis/routes/auth.service";
import { EmailWithRoleInput } from "./InvitateInput";
import { Member } from "../../../types/member";

interface InvitationModalprops {
  open: boolean;
  onClose: () => void;
  members: Member[];
}

type RoleOption = {
  value: string;
  label: string;
};

export const InvitationModal = ({
  open,
  onClose,
  members,
}: InvitationModalprops) => {
  const [userPolicies, setUserPolicies] = useState<RoleOption[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const response = await getUserPolicies(); // ex: ["Admin: Admin", ...]
        const parsed = response.map((item: string) => {
          const [valueRaw, label] = item.split(":").map((part) => part.trim());
          return {
            value: valueRaw.toLowerCase(),
            label,
          };
        });
        setUserPolicies(parsed);
      } catch (error) {
        console.error("Erro ao buscar políticas:", error);
      }
    };

    fetchUserPolicies();
  }, []);

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
            Administre quem tem acesso a esta empresa.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
          <Box sx={{ width: "80%" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              marginBottom={0.5}
              sx={{ color: "var(--neutral-500)", fontSize: "16px" }}
            >
              Email
            </Typography>
            <EmailWithRoleInput
              email={email}
              roleOptions={userPolicies}
              onEmailChange={setEmail}
              onRoleChange={() => {}}
            />
          </Box>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              width: "30%",
              marginTop: "26px",
              textTransform: "none",
              fontWeight: 600,
              color: "var(--neutral-700)",
            }}
          >
            Enviar convite
          </Button>
        </Box>
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
                role={member.permission.name.toLowerCase()}
                roles={userPolicies}
                onRoleChange={(newRole) => console.log("Novo papel:", newRole)}
              />
            ))
          ) : (
            <p>Nenhum membro encontrado.</p>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disableElevation
          sx={{
            textTransform: "none",
          }}
          variant="contained"
        >
          pronto
        </Button>
      </DialogActions>
    </Dialog>
  );
};
