import { MainTemplate } from "../../../components/AppLayout";
import {
  HeaderContainer,
  ListContainer,
  MainContainer,
  Subtitle,
  Title,
} from "./styles";
import { Box } from "@mui/material";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import { useEffect, useState } from "react";
import { BalanceteData } from "../../../types/balancete";
import { useLocation, useNavigate, useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  getBalancete,
  getBalanceteByCostCenter,
} from "../../../services/apis/routes/balancete.service";
import { BalanceSheetDetailsTable } from "./table";
import { toast } from "sonner";

export const BalanceSheetData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { balanceteId } = useParams();
  const { setLoading } = useLoading();
  const [date, setDate] = useState<string>("");
  const [balanceteCostCenterData, setBalanceteCostCenterData] = useState<
    BalanceteData[]
  >([]);

  const monthMap: Record<string, string> = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  };

  const formatDate = (month: string, year: number) => {
    const translatedMonth = monthMap[month] || month;
    return `${translatedMonth} de ${year}`;
  };

  useEffect(() => {
    const fetchBalancete = async () => {
      setLoading(true, "Buscando dados do balancete...");
      try {
        if (!balanceteId) return;
        const response = await getBalancete(+balanceteId);
        if (response.success === false) {
          toast.error(
            `Erro ao buscar dados do balancete, entre em contato com o suporte.`
          );
          return;
        }
        const date = formatDate(
          response.data[0]?.dateMonth,
          response.data[0]?.dateYear
        );
        setDate(date);
      } catch (error) {
        toast.error(
          `Erro ao buscar dados do balancete, entre em contato com o suporte. ${error}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBalancete();
  }, []);

  const fetchBalanceteData = async () => {
    setLoading(true, "Buscando dados do balancete...");
    try {
      if (!balanceteId) return;
      const response = await getBalanceteByCostCenter(+balanceteId);
      if (response.success === false) {
        toast.error(
          `Erro ao buscar dados do balancete, entre em contato com o suporte.`
        );
        return;
      }
      setBalanceteCostCenterData(response.data);
    } catch (error) {
      toast.error(
        `Erro ao buscar dados do balancete, entre em contato com o suporte. ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (balanceteId) {
      fetchBalanceteData();
    }
  }, [balanceteId]);

  const handleClickDetailed = () => {
    const basePath = location.pathname;
    navigate(`${basePath}/detalhado`);
  };

    const handleClickBalanceSheet = () => {
    const basePath = location.pathname;
    navigate(`${basePath}/balanco-contabil`);
  };


  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <RequestPageOutlinedIcon />
            <Title>Balanço Contábil</Title>
          </Box>
          <Subtitle>{date}</Subtitle>
        </HeaderContainer>
        <ListContainer>
          <BalanceSheetDetailsTable
            data={balanceteCostCenterData}
            onViewDetailed={handleClickDetailed}
            onViewBalanceSheet={handleClickBalanceSheet}
          />
        </ListContainer>
      </MainContainer>
    </MainTemplate>
  );
};
