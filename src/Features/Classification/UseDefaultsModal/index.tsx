import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ClassificationType } from "../../../types/classification";
import { ClassificationPanel } from "../ClassificationOptions";
import { getClassification, getClassificationTemplate } from "../../../services/apis/routes/classification.service";
import { toast } from "react-toastify";

interface ClassificationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClassificationModal = ({
  open,
  onClose,
  onConfirm,
}: ClassificationModalProps) => {
  const [skeleton, setSkeleton] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [classifications, setClassifications] = useState<ClassificationType[]>(
    []
  );
  const [selectedClassificationId, setSelectedClassificationId] =
    useState<number>();

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    if (savedTab) {
      setSelectedTab(Number(savedTab));
    }
  }, []);

  useEffect(() => {
    const fetchClassifications = async (type: number) => {
      try {
        setSkeleton(true);

        const cached = localStorage.getItem(`classifications-${type}`);
        if (cached) {
          setClassifications(JSON.parse(cached));
          setSkeleton(false);
          return;
        }

        const response = await getClassificationTemplate(type);
        setClassifications(response.data);
      } catch (error) {
        toast.error(
          "Erro ao buscar classificações, tente novamente mais tarde."
        );
      } finally {
        setSkeleton(false);
      }
    };

    localStorage.setItem("selectedTab", selectedTab.toString());
    fetchClassifications(selectedTab);
  }, [selectedTab]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ px: 0, textAlign: "center" }}>
        Deseja utilizar o modelo padrão de classificação para os balancetes?
      </DialogTitle>

      <DialogContent sx={{ px: 0 }}>
        <ClassificationPanel
          data={classifications}
          selectedId={selectedClassificationId}
          onTabChange={(tabId) => setSelectedTab(tabId)}
          onSelect={(id) => setSelectedClassificationId(id)}
          isLoading={skeleton}
          readOnly
        />
      </DialogContent>

      <DialogActions sx={{ px: 0, mt: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose} color="inherit">
          Criar uma nova classificação
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Utilizar padrão
        </Button>
      </DialogActions>
    </Dialog>
  );
};
