import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MainTemplate } from "../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "sonner";
import {
  getParams,
  saveParam,
  editParam,
  deleteParam,
} from "../../services/apis/routes/params.service";
import { ModalFormParameter } from "./form";
import { useAccountPlanId } from "../../utils/hooks/useAccountPlanId";

export interface Parameter {
  id: number;
  name: string;
  parameterYear: number;
  parameterValue: number;
}

export interface ParameterApiResponse {
  data: Parameter[];
  success: boolean;
}

export const Params = () => {
  const [data, setData] = useState<Parameter[]>([]);
  const { setLoading } = useLoading();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingParam, setEditingParam] = useState<Parameter | undefined>(
    undefined
  );
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });

  const fetchParameters = async () => {
    if (!accountPlanId) return;

    try {
      setLoading(true, "Buscando parâmetros financeiros");
      const response = await getParams(accountPlanId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error("Erro ao buscar parâmetros financeiros");
      }
    } catch (error) {
      console.error("Erro ao buscar parâmetros financeiros:", error);
      toast.error("Erro ao buscar parâmetros financeiros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchParameters();
    }
  }, [accountPlanId]);

  const handleEdit = (param: Parameter) => {
    setEditingParam(param);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingParam(undefined);
    setModalOpen(true);
  };

  const handleSave = async (param: Parameter | Omit<Parameter, "id">) => {
    try {
      setLoading(true, "Salvando parâmetro...");
      if ("id" in param) {
        // editar
        await editParam(param);
        setData((prev) => prev.map((p) => (p.id === param.id ? param : p)));
        toast.success("Parâmetro editado com sucesso!");
      } else {
        // criar
        const payload = {
          ...param,
          accountPlanId,
        };
        const response = await saveParam(payload);
        if (response.success) {
          fetchParameters();
          toast.success("Parâmetro criado com sucesso!");
        } else {
          toast.error("Erro ao criar parâmetro");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar parâmetro:", error);
      toast.error("Erro ao salvar parâmetro");
    } finally {
      setModalOpen(false);
      setLoading(false);
    }
  };

  const handleDelete = async (param: Parameter) => {
    const confirm = window.confirm(
      `Tem certeza que deseja excluir o parâmetro "${param.name}"?`
    );
    if (!confirm) return;

    try {
      setLoading(true, "Excluindo parâmetro...");
      await deleteParam(param.id);
      setData((prev) => prev.filter((p) => p.id !== param.id));
      toast.success("Parâmetro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir parâmetro:", error);
      toast.error("Erro ao excluir parâmetro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Parâmetros</Title>
        <Container>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{ mb: 2, maxWidth: 200 }}
          >
            Novo Parâmetro
          </Button>

          <ModalFormParameter
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            parameter={editingParam}
          />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ width: "100%" }}
          >
            <Table aria-label="params table">
              <TableHead sx={{ backgroundColor: "var(--neutral-200)" }}>
                <TableRow>
                  <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                    Nome
                  </TableCell>
                  <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                    Ano
                  </TableCell>
                  <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                    Valor (%)
                  </TableCell>
                  <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum dado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((param) => (
                    <TableRow key={param.id}>
                      <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                        {param.name}
                      </TableCell>
                      <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                        {param.parameterYear}
                      </TableCell>
                      <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                        {typeof param.parameterValue === "number"
                          ? `${param.parameterValue.toFixed(2)}%`
                          : "-"}
                      </TableCell>

                      <TableCell sx={{ borderLeft: "1px solid #e0e0e0" }}>
                        <IconButton
                          onClick={() => handleEdit(param)}
                          size="small"
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(param)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </MainContainer>
    </MainTemplate>
  );
};
