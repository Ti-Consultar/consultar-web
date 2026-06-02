import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { useMainContext } from "../../contexts/mainContext";
import { ClassificationPanel } from "./ClassificationOptions";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import {
  getClassification,
  getClassifiedBonds,
  sendAccountPlanId,
  sendClassification,
  validateClassificationModel,
} from "../../services/apis/routes/classification.service";
import {
  BondListWrapper,
  ClassificationType,
} from "../../types/classification";
import { toast } from "sonner";
import { ClassificationModal } from "./UseDefaultsModal";
import { useParams } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { AccountPlanRow, AccountPlanTable } from "./Table";
import {
  getBalanceteFiltered,
  getFirstBalanceteByAccountPlan,
} from "../../services/apis/routes/balancete.service";
import { useAccountPlanId } from "../../utils/hooks/useAccountPlanId";

interface BondListItem {
  accountPlanClassificationId: number;
  costCenters: { costCenter: string }[];
  classificationName: string;
}

const ClassificationPage = () => {
  const { setBreadcrumbs } = useMainContext();
  const [skeleton, setSkeleton] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [balanceteId, setBalanceteId] = useState<number>();
  const [classifications, setClassifications] = useState<ClassificationType[]>(
    []
  );
  const [selectedClassificationId, setSelectedClassificationId] =
    useState<number>();
  const [open, setOpen] = useState(false);
  const [accountType, setAccountType] = useState(0);
  const { groupId, companyid, subCompanyId } = useParams();
  const [balanceteData, setBalanceteData] = useState<AccountPlanRow[]>([]);
  const [allBalanceteData, setAllBalanceteData] = useState<AccountPlanRow[]>(
    []
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { setLoading } = useLoading();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [classificationBonds, setClassificationBonds] = useState<{
    bondList: BondListItem[];
  }>(() => {
    const saved = localStorage.getItem("classification-bondList");
    return saved ? JSON.parse(saved) : { bondList: [] };
  });
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId,
  });

  const handleSelect = (ids: string[]) => {
    setSelectedKeys(ids);
  };

  const classifiedRows = classificationBonds.bondList.flatMap((group) =>
    group.costCenters.map((item) => {
      const account = allBalanceteData.find(
        (row) => row.costCenter === item.costCenter
      );

      return {
        accountPlanClassificationId: group.accountPlanClassificationId,
        classificationName: group.classificationName,
        costCenter: item.costCenter,
        name: account?.name || "Conta não encontrada na tabela",
      };
    })
  );

  useEffect(() => {
    setBreadcrumbs([
      { name: "Grupos", link: "/grupos" },
      { name: "Classificação", link: "" },
    ]);
  }, []);

  const handleAccountTypeChange = (accountType: number) => {
    setAccountType(accountType);
    getBalanceteByAccountType(accountType);
  };

  const loadExistingClassifications = async (accountPlanId: number) => {
    try {
      const response = await getClassifiedBonds(accountPlanId);
      if (response.success) {
        if (
          typeof response.data === "string" &&
          ["Não encontrado", "Nao encontrado"].includes(response.data)
        ) {
          return;
        }

        const newBondList = { bondList: response.data || [] };

        setClassificationBonds(newBondList);

        localStorage.setItem(
          "classification-bondList",
          JSON.stringify(newBondList)
        );
      }
    } catch (error) {
      console.error("Erro ao buscar classificações existentes", error);
      toast.error("Erro ao buscar classificações já salvas.");
    }
  };

  const loadClassificationsFlow = async () => {
    if (!accountPlanId) return;

    try {
      setSkeleton(true);

      const response = await validateClassificationModel(accountPlanId);
      const isValid = response.data === true;

      setOpen(!isValid);

      if (isValid) {
        const classificationResponse = await getClassification(
          selectedTab,
          accountPlanId
        );
        setClassifications(classificationResponse.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setSkeleton(false);
    }
  };

  useEffect(() => {
    loadClassificationsFlow();
  }, [accountPlanId, selectedTab]);

  const loadFirstBalancete = async () => {
    try {
      if (!accountPlanId) return;

      localStorage.removeItem("classification-bondList");
      setSelectedKeys([]);
      setLoading(true, "Buscando contas...");

      const response = await getFirstBalanceteByAccountPlan(accountPlanId);
      if (response.success === true) {
        const accounts = response.data?.dataDto || [];
        setBalanceteData(accounts);
        setAllBalanceteData(accounts);
        setBalanceteId(response.data?.balancete?.id);

        await loadExistingClassifications(accountPlanId);
      }
    } catch {
      toast.error("Erro ao carregar as contas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirstBalancete();
  }, [accountPlanId]);

  const updateBondList = (bondList: BondListItem[]) => {
    const newBondList = { bondList };
    setClassificationBonds(newBondList);
    localStorage.setItem(
      "classification-bondList",
      JSON.stringify(newBondList)
    );
  };

  const handleClassificationChange = (classificationId: number) => {
    if (!classificationId) return;
    setSelectedKeys([]);

    setClassificationBonds((prev) => {
      let bondList = [...prev.bondList];

      let group = bondList.find(
        (item) => item.accountPlanClassificationId === classificationId
      );

      if (!group) {
        group = {
          accountPlanClassificationId: classificationId,
          classificationName:
            classifications.find((c) => c.id === classificationId)?.name ||
            "Sem nome",
          costCenters: [],
        };
        bondList.push(group);
      }

      selectedKeys.forEach((costCenter) => {
        if (!group.costCenters.some((cc) => cc.costCenter === costCenter)) {
          group.costCenters.push({ costCenter });
        }
      });

      bondList = bondList.map((item) => {
        if (item.accountPlanClassificationId !== classificationId) {
          return {
            ...item,
            costCenters: item.costCenters.filter(
              (cc) => !selectedKeys.includes(cc.costCenter)
            ),
          };
        }
        return item;
      });

      updateBondList(bondList);
      return { bondList };
    });

    setSelectedClassificationId(classificationId);
  };

  const useDefaultClassification = async () => {
    try {
      setLoading(true, "Aplicando modelo...");
      if (!accountPlanId) return;
      const response = await sendAccountPlanId({
        accountPlanId: accountPlanId,
      });
      if (response.success === true) {
        toast.success("Classificação aplicada");
        loadClassificationsFlow();
        setOpen(false);
      } else {
        toast.error("Erro ao aplicar classificação.");
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSaveConfirmation = () => {
    if (classifiedRows.length === 0) {
      toast.warning("Nenhuma classificação para enviar.");
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleSaveClassification = async () => {
    try {
      if (!accountPlanId) return;
      const saved = localStorage.getItem("classification-bondList");
      if (!saved) {
        toast.warning("Nenhuma classificação para enviar.");
        return;
      }

      const parsed: BondListWrapper = JSON.parse(saved);

      const bondList = (parsed.bondList || []).filter(
        (group) => group.costCenters.length > 0
      );

      if (bondList.length === 0) {
        toast.warning("Nenhuma classificação para enviar.");
        return;
      }

      setLoading(true, "Enviando classificação...");

      const response = await sendClassification({ bondList }, accountPlanId);

      if (response.success === true) {
        toast.success("Classificação enviada com sucesso!");
        localStorage.removeItem("classification-bondList");
        const allClassifiedCostCenters = classificationBonds.bondList.flatMap(
          (group) => group.costCenters.map((cc) => cc.costCenter)
        );

        handleRemoveClassified(allClassifiedCostCenters);
        setSelectedKeys([]);
        setConfirmModalOpen(false);
        setReviewModalOpen(false);
        loadExistingClassifications(accountPlanId);
      } else {
        toast.error("Erro ao classificar.");
      }
    } catch (error) {
      toast.error("Erro ao enviar classificação.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBalanceteByAccountType = async (accountType: number) => {
    try {
      if (!accountType) {
        await loadFirstBalancete();
        return;
      }

      if (!balanceteId) return;

      setLoading(true, "Buscando balancete por tipo de conta...");

      const response = await getBalanceteFiltered(balanceteId, accountType);
      if (response.success === true) {
        setBalanceteData(response?.data || []);
      } else {
        toast.error("Erro ao buscar balancete por tipo de conta.");
      }
    } catch (error) {
      toast.error("Erro ao buscar balancete por tipo de conta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClassified = (costCentersToRemove: string[]) => {
    setClassificationBonds((prev) => {
      const bondList = prev.bondList
        .map((group) => ({
          ...group,
          costCenters: group.costCenters.filter(
            (cc) => !costCentersToRemove.includes(cc.costCenter)
          ),
        }))
        .filter((group) => group.costCenters.length > 0);
      updateBondList(bondList);
      return { bondList };
    });
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Box>
          <Title>Classificação</Title>
        </Box>
        <Box>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <AccountPlanTable
                      data={balanceteData}
                      selectedKeys={selectedKeys}
                      onSelect={handleSelect}
                      onSort={() => {}}
                      accountType={accountType}
                      onAccountTypeChange={handleAccountTypeChange}
                      classificationBonds={classificationBonds}
                      onRemoveClassified={handleRemoveClassified}
                    />
                  </Grid2>
                </Grid2>
              </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      onClick={handleOpenSaveConfirmation}
                      fullWidth
                      startIcon={<LinkOutlinedIcon />}
                    >
                      Classificar
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <ClassificationPanel
                      data={classifications}
                      selectedId={selectedClassificationId}
                      onTabChange={(tabId) => setSelectedTab(tabId)}
                      onSelect={handleClassificationChange}
                      isLoading={skeleton}
                    />
                  </Grid2>
                </Grid2>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
        <ClassificationModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={useDefaultClassification}
        />
        <Dialog
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <FactCheckOutlinedIcon color="primary" />
              <Typography variant="h6">Confirmar classificação</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              {classifiedRows.length} item(ns) serão enviados para
              classificação.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button color="inherit" onClick={() => setConfirmModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setConfirmModalOpen(false);
                setReviewModalOpen(true);
              }}
            >
              Revisar
            </Button>
            <Button variant="contained" onClick={handleSaveClassification}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle>Revisar classificações</DialogTitle>
          <DialogContent>
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Conta</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Classificação</TableCell>
                    <TableCell align="right">Remover</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classifiedRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Nenhuma classificação selecionada.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    classifiedRows.map((row) => (
                      <TableRow
                        key={`${row.accountPlanClassificationId}-${row.costCenter}`}
                        hover
                      >
                        <TableCell>{row.costCenter}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.classificationName}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              handleRemoveClassified([row.costCenter])
                            }
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button color="inherit" onClick={() => setReviewModalOpen(false)}>
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveClassification}
              disabled={classifiedRows.length === 0}
            >
              Confirmar classificação
            </Button>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </MainTemplate>
  );
};

export default ClassificationPage;
