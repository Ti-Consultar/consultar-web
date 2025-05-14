import { useState } from "react";
import EditableField from "../../../../components/Inputs/EditableText";
import {
  Container,
  Info,
  InfoContainer,
  NameText,
  ProfileCardContainer,
  ProfilePic,
} from "./styles";
import { Box, Button } from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export const ProfileCard = () => {
  const [phone, setPhone] = useState("31984914474");
  const [email, setEmail] = useState("wevertonoliveira@gmail.com");
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(phone);

  return (
    <ProfileCardContainer>
      <Container>
        <ProfilePic>
          <p>WE</p>
        </ProfilePic>
      </Container>
      <InfoContainer>
        <NameText>Weverton Oliveira</NameText>
        <Info
          style={{
            fontWeight: "var(--fontWeightSemiBold)",
          }}
        >
          Desenvolvedor
        </Info>
        <EditableField
          value={email}
          isEditing={editing}
          onChangeDraft={setDraftName}
          placeholder=""
        />
        <EditableField
          value={phone}
          isEditing={editing}
          onChangeDraft={setDraftName}
          placeholder=""
        />
      </InfoContainer>
      <Box>
        {editing ? (
          <div style={{marginLeft: '1.5rem', display: 'flex', gap: '1rem'}}>
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
