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
import { AccountPlan, Balancetes } from "../../../types/balancete";
import { useLocation, useNavigate, useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { getBalancetes } from "../../../services/apis/routes/balancete.service";
import { AccountingTable } from "../BalanceSheetList/table";
import { toast } from "react-toastify";

export const BalanceSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, companyid, subCompanyId } = useParams();
  const { setLoading } = useLoading();
  const [accountPlan, setAccountPlan] = useState<AccountPlan>();
  const [accountPlanId, setAccountPlanId] = useState<number>();
  const [balanceteList, setBalanceteList] = useState<Balancetes>({
    id: 0,
    balancetes: [],
  });

  useEffect(() => {
    const fetchAccountPlan = async () => {
      setLoading(true, "Buscando plano de contas...");
      try {
        if (!groupId) return;
        const response = await getAccountPlan(
          +groupId,
          companyid ? +companyid : undefined,
          subCompanyId ? +subCompanyId : undefined
        );
        setAccountPlan(response.data[0]);
        setAccountPlanId(response.data[0].id);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchAccountPlan();
  }, []);

  const handleRowClick = (balanceteId: number) => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    navigate(`${basePath}/${balanceteId}`);
  };

  const fetchBalancetes = async () => {
    setLoading(true, "Buscando balancetes...");
    try {
      if (!accountPlanId) return;
      const response = await getBalancetes(accountPlanId);
      if (response?.success === false) {
        toast.error(
          `Erro ao buscar os balancetes, entre em contato com o suporte.`
        );
        return;
      }
      setBalanceteList(response.data);
    } catch (error) {
      toast.error(
        `Erro ao buscar os balancetes, entre em contato com o suporte.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchBalancetes();
    }
  }, [accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <RequestPageOutlinedIcon />
            <Title>Balancetes</Title>
          </Box>
          <Subtitle>
            {accountPlan?.subCompany?.name ??
              accountPlan?.company?.name ??
              accountPlan?.group?.name}
          </Subtitle>
        </HeaderContainer>
        <ListContainer>
          <AccountingTable data={balanceteList} onRowClick={handleRowClick} />
        </ListContainer>
      </MainContainer>
    </MainTemplate>
  );
};
