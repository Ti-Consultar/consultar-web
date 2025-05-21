import { useState } from "react";
import EditableField from "../../../../components/Inputs/EditableText";
import {
  Container,
  Info,
  InfoContainer,
  NameText,
  ProfileCardContainer,
} from "./styles";
import { Avatar, Box, Button } from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  onSave?: () => void;
  onEdit?: () => void;
}

export const ProfileCard = ({
  name,
  role,
  onSave,
  onEdit,
  email,
  phoneNumber,
}: ProfileCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(phoneNumber);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
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
        <NameText>{name}</NameText>
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
          value={email}
          isEditing={editing}
          onChangeDraft={setDraftName}
          placeholder=""
        />
        <EditableField
          value={phoneNumber}
          isEditing={editing}
          onChangeDraft={setDraftName}
          placeholder=""
        />
      </InfoContainer>
      <Box>
        {editing ? (
          <div style={{ marginLeft: "1.5rem", display: "flex", gap: "1rem" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
              endIcon={<CheckCircleOutlineOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "15px",
              }}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setEditing(false)}
              endIcon={<CancelOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "15px",
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
              borderRadius: "15px",
            }}
          >
            Editar
          </Button>
        )}
      </Box>
    </ProfileCardContainer>
  );
};
