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
import { useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { BalanceSheetTable } from "./table";
import { getBalanceteData } from "../../../services/apis/routes/balancete.service";
import { BalanceteData } from "../../../types/balancete";
import { toast } from "sonner";

const BalanceSheetDetailed = () => {
  const { balanceteId } = useParams();
  const { setLoading } = useLoading();
  const [balanceteDataDetailed, setBalanceteDataDetailed] = useState<
    BalanceteData[]
  >([]);
  const [date, setDate] = useState<string>("");

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
    const fetchBalanceSheetData = async () => {
      setLoading(true, "Buscando dados do balancete...");
      try {
        if (!balanceteId) return;
        const response = await getBalanceteData(+balanceteId);
        if (response?.success) {
          setBalanceteDataDetailed(response.data?.dataDto);
          const date = formatDate(
            response.data?.balancete?.dateMonth,
            response.data?.balancete?.dateYear
          );
          setDate(date);
        }
      } catch {
        toast.error("Ocorreu um erro ao tentar obter os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceSheetData();
  }, []);

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <RequestPageOutlinedIcon />
            <Title>Balanço Contábil Detalhado</Title>
          </Box>
          <Subtitle>{date}</Subtitle>
        </HeaderContainer>
        <ListContainer>
          <BalanceSheetTable data={balanceteDataDetailed} />
        </ListContainer>
      </MainContainer>
    </MainTemplate>
  );
};

export default BalanceSheetDetailed;
