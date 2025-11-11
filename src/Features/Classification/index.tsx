import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { useMainContext } from "../../contexts/mainContext";
import { ClassificationPanel } from "./ClassificationOptions";
import { Box, Button, Card, Grid2 } from "@mui/material";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
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
import { toast } from "react-toastify";
import { ClassificationModal } from "./UseDefaultsModal";
import { useParams } from "react-router";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { AccountPlanTable } from "./Table";
import { MonthYearPickerSearch } from "./MonthYearPickerSearch";
import {
  getBalanceteByDate,
  getBalanceteFiltered,
} from "../../services/apis/routes/balancete.service";

interface BondListItem {
  accountPlanClassificationId: number;
  costCenters: { costCenter: string }[];
  classificationName: string;
}

export const ClassificationPage = () => {
  const { setBreadcrumbs } = useMainContext();
  const [skeleton, setSkeleton] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [accountPlanId, setAccountPlanId] = useState<number>();
  const [balanceteId, setBalanceteId] = useState<number>();
  const [classifications, setClassifications] = useState<ClassificationType[]>(
    []
  );
  const [selectedClassificationId, setSelectedClassificationId] =
    useState<number>();
  const [open, setOpen] = useState(false);
  const [accountType, setAccountType] = useState<number>();
  const { groupId, companyid, subcompanyid } = useParams();
  const [balanceteData, setBalanceteData] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [classificationBonds, setClassificationBonds] = useState<{
    bondList: BondListItem[];
  }>(() => {
    const saved = localStorage.getItem("classification-bondList");
    return saved ? JSON.parse(saved) : { bondList: [] };
  });

  const handleSelect = (ids: string[]) => {
    setSelectedKeys(ids);
  };

  // Atualiza breadcrumb no mount
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

  // Busca accountPlanId no mount e quando params mudam
  useEffect(() => {
    if (groupId) {
      const getAccountPlanId = async (
        groupId: number,
        companyId?: number,
        subCompanyId?: number
      ): Promise<void> => {
        try {
          const response = await getAccountPlan(
            groupId,
            companyId,
            subCompanyId
          );
          const data = response.data;
          if (!Array.isArray(data) || data.length === 0) return;
          setAccountPlanId(data[0]?.id);
        } catch (error) {
          console.error("Failed to fetch AccountPlanId", error);
          throw error;
        }
      };

      getAccountPlanId(
        +groupId,
        companyid ? +companyid : undefined,
        subcompanyid ? +subcompanyid : undefined
      );
    }
  }, [groupId, companyid, subcompanyid]);

  const loadExistingClassifications = async (accountPlanId: number) => {
    try {
      const response = await getClassifiedBonds(accountPlanId);
      if (response.success) {
        if (response.data === "Não encontrado") {
          return;
        } else {
          const newBondList = { bondList: response.data || [] };

          setClassificationBonds(newBondList);

          localStorage.setItem(
            "classification-bondList",
            JSON.stringify(newBondList)
          );
        }
      }
    } catch (error) {
      console.error("Erro ao buscar classificações existentes", error);
      toast.error("Erro ao buscar classificações já salvas.");
    }
  };

  // Valida modelo de classificação
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

  const updateBondList = (bondList: BondListItem[]) => {
    const newBondList = { bondList };
    setClassificationBonds(newBondList);
    localStorage.setItem(
      "classification-bondList",
      JSON.stringify(newBondList)
    );
  };

  // Atualiza bondList e salva localStorage no momento da seleção da classificação
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

  const handleMonthYearSearch = async ({
    month,
    year,
  }: {
    month: number;
    year: number;
  }) => {
    try {
      if (!accountPlanId) return;

      localStorage.removeItem("classification-bondList");
      setSelectedKeys([]);
      const response = await getBalanceteByDate(accountPlanId, year, month);
      if (response.success === true) {
        setBalanceteData(response.data?.dataDto);
        setBalanceteId(response.data?.balancete?.id);

        await loadExistingClassifications(accountPlanId);
      }
    } catch {
      toast.error("Erro ao buscar balancete por data.");
    }
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

      if (!parsed.bondList || parsed.bondList.length === 0) {
        toast.warning("Nenhuma classificação para enviar.");
        return;
      }

      setLoading(true, "Enviando classificação...");

      const response = await sendClassification(parsed, accountPlanId);

      if (response.success === true) {
        toast.success("Classificação enviada com sucesso!");
        localStorage.removeItem("classification-bondList");
        const allClassifiedCostCenters = classificationBonds.bondList.flatMap(
          (group) => group.costCenters.map((cc) => cc.costCenter)
        );

        handleRemoveClassified(allClassifiedCostCenters);
        setSelectedKeys([]);
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
      if (!balanceteId) return;
      if (!accountType) return;

      setLoading(true, "Buscando balancete por tipo de conta...");

      const response = await getBalanceteFiltered(balanceteId, accountType);
      if (response.success === true) {
        setBalanceteData(response?.data);
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
      const bondList = prev.bondList.map((group) => ({
        ...group,
        costCenters: group.costCenters.filter(
          (cc) => !costCentersToRemove.includes(cc.costCenter)
        ),
      }));
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
            {/* Coluna esquerda: Filtros e Tabela */}
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                  {/* Linha de filtros */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <MonthYearPickerSearch onSearch={handleMonthYearSearch} />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    {/* Select de resultados */}
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 2 }}>{/* Pesquisa */}</Grid2>

                  <Grid2 size={{ xs: 12, md: 2 }}>{/* Botão de busca */}</Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <AccountPlanTable
                      data={balanceteData}
                      selectedKeys={selectedKeys}
                      onSelect={handleSelect}
                      onSort={() => {}}
                      accountType={accountType ? accountType : 0}
                      onAccountTypeChange={handleAccountTypeChange}
                      classificationBonds={classificationBonds}
                      onRemoveClassified={handleRemoveClassified}
                    />
                  </Grid2>
                </Grid2>
              </Card>
            </Grid2>

            {/* Coluna direita: Classificação */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveClassification}
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
      </MainContainer>
    </MainTemplate>
  );
};
