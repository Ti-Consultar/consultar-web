import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { useMainContext } from "../../contexts/mainContext";
import { ClassificationPanel } from "./ClassificationOptions";
import { Box, Button, Card, Grid2 } from "@mui/material";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import {
  getClassification,
  sendAccountPlanId,
  validateClassificationModel,
} from "../../services/apis/routes/classification.service";
import { ClassificationType } from "../../types/classification";
import { toast } from "react-toastify";
import { ClassificationModal } from "./UseDefaultsModal";
import { useParams } from "react-router";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { AccountPlanTable } from "./Table";
import { MonthYearPickerSearch } from "./MonthYearPickerSearch";
import { getBalanceteByDate } from "../../services/apis/routes/balancete.service";

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
  const [classifications, setClassifications] = useState<ClassificationType[]>(
    []
  );
  const [selectedClassificationId, setSelectedClassificationId] =
    useState<number>();
  const [open, setOpen] = useState(false);
  const { groupId, companyid, subcompanyid } = useParams();
  const [balanceteData, setBalanceteData] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Estado para bondList (classificações com centros de custo)
  const [classificationBonds, setClassificationBonds] = useState<{
    bondList: BondListItem[];
  }>(() => {
    // Inicializa do localStorage se tiver
    const saved = localStorage.getItem("classification-bondList");
    return saved ? JSON.parse(saved) : { bondList: [] };
  });

  const handleSelect = (ids: string[]) => {
    setSelectedKeys(ids);
    console.log("Selecionados:", ids);
  };

  // Atualiza breadcrumb no mount
  useEffect(() => {
    setBreadcrumbs([
      { name: "Grupos", link: "/grupos" },
      { name: "Classificação", link: "" },
    ]);
  }, []);

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

  // Valida modelo de classificação
  useEffect(() => {
    const validateHasClassificationModel = async (classificationId: number) => {
      try {
        if (!accountPlanId) return;
        const response = await validateClassificationModel(classificationId);
        if (response.data === true) {
          setOpen(false);
        } else {
          setOpen(true);
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    };

    validateHasClassificationModel(accountPlanId ?? 0);
  }, [accountPlanId]);

  // Busca e carrega classificações
  useEffect(() => {
    const fetchClassifications = async (type: number) => {
      try {
        setSkeleton(true);

        // Cache localStorage
        const cached = localStorage.getItem(`classifications-${type}`);
        if (cached) {
          setClassifications(JSON.parse(cached));
          setSkeleton(false);
          return;
        }

        const response = await getClassification(type);
        setClassifications(response.data);

        localStorage.setItem(
          `classifications-${type}`,
          JSON.stringify(response.data)
        );
      } catch {
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

  // Atualiza bondList e salva localStorage no momento da seleção da classificação
  const handleClassificationChange = (classificationId: number) => {
    if (!classificationId) return;

    setClassificationBonds((prev) => {
      // Clona bondList
      let bondList = [...prev.bondList];

      // Procura grupo com classificationId
      let group = bondList.find(
        (item) => item.accountPlanClassificationId === classificationId
      );

      if (!group) {
        group = {
          accountPlanClassificationId: classificationId,
          classificationName: classifications.find(
            (c) => c.id === classificationId
          )?.name || "Sem nome",
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

      const newBondList = { bondList };
      localStorage.setItem(
        "classification-bondList",
        JSON.stringify(newBondList)
      );
      return newBondList;
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
      const response = await getBalanceteByDate(accountPlanId, year, month);
      if (response.success === true) {
        setBalanceteData(response.data?.dataDto);
      }
    } catch {
      toast.error("Erro ao buscar balancete por data.");
    }
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
                      accountType={1}
                      onAccountTypeChange={() => {}}
                      classificationBonds={classificationBonds}
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
                      onClick={() => {
                        // aqui só chama a API usando classificationBonds
                        console.log(
                          "Enviar classificação para API:",
                          classificationBonds
                        );
                      }}
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
