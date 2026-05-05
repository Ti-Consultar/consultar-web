import { useEffect, useState } from "react";
import EditableField from "../../../../components/Inputs/EditableText";
import { Container, Info, InfoContainer, ProfileCardContainer } from "./styles";
import { Avatar, Box, Button, ClickAwayListener } from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ProfileChanges } from "../../../../types/profile";
import { useLoading } from "../../../../contexts/LoadingProvider";
import { editUserInfo } from "../../../../services/apis/routes/profile.service";
import { toast } from "sonner";
import { formatPhone } from "../../../../utils/formatters/phoneMask";

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  contact: string;
  onSave?: () => void;
  onEdit?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileCard = ({
  name,
  role,
  email,
  contact,
  onChange,
}: ProfileCardProps) => {
  const { setLoading } = useLoading();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileChanges>({
    name,
    email,
    contact,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const onSubmit = async () => {
    setLoading(true, "Salvando informações...");

    try {
      const response = await editUserInfo(draft);

      if (response === "Inserido com Sucesso") {
        toast.success("Informações salvas com sucesso.");
        return;
      }

      toast.dismiss();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Um erro ocorreu ao tentar salvar as informações");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDraft({ name, email, contact });
  }, [name, email, contact]);

  const handleSubmit = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
    const isNameValid = draft.name.trim() !== "";
    const isContactValid = draft.contact.trim() !== "";

    if (!isNameValid || !isEmailValid || !isContactValid) {
      if (!isNameValid) toast.warning("O nome não pode estar vazio.");
      if (!isEmailValid) toast.warning("Digite um e-mail válido.");
      if (!isContactValid) toast.warning("O contato não pode estar vazio.");
      return;
    }

    onSubmit();
    setEditing(false);
  };

  // 👇 função de reset reutilizada no cancelar e no click fora
  const handleReset = () => {
    setDraft({ name, email, contact });
    setEditing(false);
  };

  return (
    <ClickAwayListener onClickAway={() => { if (editing) handleReset(); }}>
      <ProfileCardContainer>
        <Container>
          <Avatar
            sx={{
              alignItems: "center",
              backgroundColor: "var(--neutral-800)",
              borderRadius: "80px",
              display: "flex",
              height: "80px",
              width: "80px",
              marginRight: "16px",
              justifyContent: "center",
              "& p": {
                fontSize: "32px",
                color: "var(--neutral-white)",
                fontWeight: "var(--fontWeightBold)",
              },
            }}
          >
            <p>{getInitials(name)}</p>
          </Avatar>
        </Container>
        <InfoContainer>
          <EditableField
            value={draft.name}
            style={{ fontSize: "20px" }}
            isEditing={editing}
            onChangeDraft={(val) => setDraft((prev) => ({ ...prev, name: val }))}
            placeholder="Nome"
            inputStyle={{
              marginBottom: "10px",
              padding: "0 10px",
              maxWidth: "60%",
            }}
          />
          <Info
            style={{
              fontWeight: "var(--fontWeightSemiBold)",
              ...(role === "Desenvolvedor"
                ? {
                  background:
                    "linear-gradient(90deg, #FFD700,rgb(191, 115, 0))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
                : {}),
            }}
          >
            {role}
          </Info>
          <EditableField
            inputStyle={{
              marginBottom: "10px",
              padding: "0 10px",
              maxWidth: "60%",
            }}
            value={draft.email}
            isEditing={editing}
            onChangeDraft={(val) => setDraft((prev) => ({ ...prev, email: val }))}
            placeholder=""
          />
          <EditableField
            inputStyle={{
              marginBottom: "10px",
              padding: "0 10px",
              maxWidth: "60%",
            }}
            value={draft.contact}
            isEditing={editing}
            onChangeDraft={(val) =>
              setDraft((prev) => ({ ...prev, contact: formatPhone(val) }))
            }
            placeholder="(00) 00000-0000"
          />
        </InfoContainer>
        <Box>
          {editing ? (
            <div style={{ marginLeft: "1.5rem", display: "flex", gap: "1rem" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
                endIcon={<CheckCircleOutlineOutlinedIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                }}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleReset} // 👈 reseta ao cancelar
                endIcon={<CancelOutlinedIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                }}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setEditing(true)}
              endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              fullWidth
              sx={{
                textTransform: "none",
                borderRadius: "10px",
              }}
            >
              Editar
            </Button>
          )}
        </Box>
      </ProfileCardContainer>
    </ClickAwayListener>
  );
};