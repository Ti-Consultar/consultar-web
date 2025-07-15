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
import {
  getBalanceteData,
  getBalanceteFiltered,
} from "../../../services/apis/routes/balancete.service";
import { BalanceteData } from "../../../types/balancete";
import { toast } from "react-toastify";
import { TableTabs } from "./table";

export const BalanceAssetsLiabilities = () => {
  const { balanceteId } = useParams();
  const { setLoading } = useLoading();
  const [balanceteDataDetailed, setBalanceteDataDetailed] = useState<
    BalanceteData[]
  >([]);
  const [ativo, setAtivo] = useState<BalanceteData[]>([]);
  const [passivo, setPassivo] = useState<BalanceteData[]>([]);
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
    const fetchAllBalanceteData = async () => {
      if (!balanceteId) return;

      try {
        setLoading(true, "Carregando dados do balancete...");

        // Faz as duas requisições em paralelo
        const [detailsRes, ativosRes, passivosRes] = await Promise.all([
          getBalanceteData(+balanceteId),
          getBalanceteFiltered(+balanceteId, 1),
          getBalanceteFiltered(+balanceteId, 2),
        ]);

        // Trata dados detalhados
        if (detailsRes?.success) {
          setBalanceteDataDetailed(detailsRes.data?.dataDto);

          const date = formatDate(
            detailsRes.data?.balancete?.dateMonth,
            detailsRes.data?.balancete?.dateYear
          );
          setDate(date);
        }

        // Trata ativos e passivos
        if (ativosRes?.success) {
          setAtivo(ativosRes.data);
        }

        if (passivosRes?.success) {
          setPassivo(passivosRes.data);
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao tentar obter os dados do balancete.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBalanceteData();
  }, []);

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <RequestPageOutlinedIcon />
            <Title>Balanço Patrimonial Contábil</Title>
          </Box>
          <Subtitle>{date}</Subtitle>
        </HeaderContainer>
        <ListContainer>
          {balanceteDataDetailed.length > 0 && (
            <TableTabs ativos={ativo} passivos={passivo} />
          )}
        </ListContainer>
      </MainContainer>
    </MainTemplate>
  );
};
