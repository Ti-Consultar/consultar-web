import { Route, Routes } from "react-router-dom";
import { Box, Skeleton, Stack } from "@mui/material";
import { lazy, Suspense, type PropsWithChildren, type ReactNode } from "react";

/* Landing page e rotas simples */
const Home = lazy(() => import("../../landingPage"));
const ForgotPassword = lazy(
  () => import("../../Features/Authentication/forgot-password")
);
const PasswordSent = lazy(
  () => import("../../Features/Authentication/forgot-password/password-sent")
);
const Authentication = lazy(() => import("../../Features/Authentication"));

/* Perfil */
const ProfileInfo = lazy(() => import("../../Features/Profile"));
const ProfileSecurity = lazy(
  () => import("../../Features/Profile/ProfileSecurity")
);
const ProfileCustomizing = lazy(
  () => import("../../Features/Profile/ProfileCustomizing")
);
const UsersSettings = lazy(
  () => import("../../Features/Profile/UsersSettings")
);

/* Grupos / Empresas */
const Groups = lazy(() => import("../../Features/Groups"));
const Companies = lazy(() => import("../../Features/Companies"));

/* Balancete, Contábil, DRE */
const BalanceSheetData = lazy(
  () => import("../../Features/ChartAccounts/BalanceSheetData")
);
const BalanceSheetDetailed = lazy(
  () => import("../../Features/ChartAccounts/BalanceSheetDetailed")
);
const BalanceAssetsLiabilities = lazy(
  () => import("../../Features/ChartAccounts/BalanceAssetsLiabilities")
);

const BalancoContabil = lazy(
  () => import("../../Features/BalanceSheet/BalanceSheet")
);
const BalancoReclassificado = lazy(
  () => import("../../Features/BalanceSheet/BalancoReclassificado")
);

/* Classificação */
const ClassificationPage = lazy(() => import("../../Features/Classification"));

/* Resultados */
const GestaoLiquidez = lazy(
  () => import("../../Features/Results/GestaoLiquidez")
);
const IndicesEconomicos = lazy(
  () => import("../../Features/Results/IndicesEconomicos")
);
const CILeEC = lazy(() => import("../../Features/Results/CILeEC"));
const EficienciaOperacional = lazy(
  () => import("../../Features/Results/EficienciaOperacional")
);

/* Home interna */
const MrpHome = lazy(() => import("../../Features/Home"));

/* Parâmetros */
const Params = lazy(() => import("../../Features/Params"));

/* Fluxo de Caixa */
const CashFlow = lazy(() => import("../../Features/CashFlow"));

/* FEVA */
const AgregadoMensal = lazy(() => import("../../Features/ValueTree/EVA"));

/* Upload */
const UploadBalanceSheet = lazy(
  () => import("../../Features/Upload/UploadBalanceSheet")
);
const UploadBudgetSheet = lazy(
  () => import("../../Features/Upload/UploadBudgetSheet")
);

/* Not Found */
const NotFoundPage = lazy(() => import("../../Features/NotFoundPage"));

/* Helper */
import { withScopes } from "./helper";

const PageContainer = ({ children }: PropsWithChildren) => (
  <Box padding={3} display="flex" flexDirection="column" gap={2}>
    {children}
  </Box>
);

const AuthSkeleton = () => (
  <Box
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    padding={3}
  >
    <Stack width="100%" maxWidth={420} spacing={2}>
      <Skeleton variant="text" width="70%" height={36} />
      <Skeleton variant="rectangular" height={48} />
      <Skeleton variant="rectangular" height={48} />
      <Skeleton variant="rectangular" height={42} />
    </Stack>
  </Box>
);

const LandingSkeleton = () => (
  <PageContainer>
    <Skeleton variant="text" width="30%" height={44} />
    <Skeleton variant="text" width="55%" height={28} />
    <Skeleton variant="rectangular" height={280} />
  </PageContainer>
);

const ContentPageSkeleton = () => (
  <PageContainer>
    <Skeleton variant="text" width="35%" height={36} />
    <Skeleton variant="rectangular" height={64} />
    <Skeleton variant="rectangular" height={420} />
  </PageContainer>
);

const DashboardSkeleton = () => (
  <PageContainer>
    <Skeleton variant="text" width="30%" height={36} />
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <Skeleton
        variant="rectangular"
        height={160}
        sx={{ width: { xs: "100%", md: "50%" } }}
      />
      <Skeleton
        variant="rectangular"
        height={160}
        sx={{ width: { xs: "100%", md: "50%" } }}
      />
    </Stack>
    <Skeleton variant="rectangular" height={320} />
  </PageContainer>
);

const TablePageSkeleton = () => (
  <PageContainer>
    <Skeleton variant="text" width="30%" height={36} />
    <Skeleton variant="rectangular" height={56} />
    <Stack spacing={1.5}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={56} />
      ))}
    </Stack>
  </PageContainer>
);

const withFallback = (element: ReactNode, fallback: ReactNode) => (
  <Suspense fallback={fallback}>{element}</Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={withFallback(<NotFoundPage />, <ContentPageSkeleton />)} />
      <Route path="/" element={withFallback(<Home />, <LandingSkeleton />)} />
      <Route
        path="/perfil/informacoes"
        element={withFallback(<ProfileInfo />, <ContentPageSkeleton />)}
      />
      <Route
        path="/perfil/seguranca"
        element={withFallback(<ProfileSecurity />, <ContentPageSkeleton />)}
      />
      <Route
        path="/perfil/personalizacao"
        element={withFallback(<ProfileCustomizing />, <ContentPageSkeleton />)}
      />
      <Route
        path="/users"
        element={withFallback(<UsersSettings />, <TablePageSkeleton />)}
      />

      <Route path="/login" element={withFallback(<Authentication />, <AuthSkeleton />)} />
      <Route
        path="/recuperar-senha"
        element={withFallback(<ForgotPassword />, <AuthSkeleton />)}
      />
      <Route
        path="/recuperar-senha/senha-enviada"
        element={withFallback(<PasswordSent />, <AuthSkeleton />)}
      />

      <Route path="/dashboard" element={withFallback(<MrpHome />, <DashboardSkeleton />)} />

      <Route path="/grupos" element={withFallback(<Groups />, <TablePageSkeleton />)} />
      <Route
        path="/grupos/:groupId/empresas"
        element={withFallback(<Companies />, <TablePageSkeleton />)}
      />
      <Route
        path="/grupos/:groupId/empresas/:companyId/filiais"
        element={withFallback(<Companies />, <TablePageSkeleton />)}
      />

      {/* Upload Balancete */}
      {withScopes("arquivos/upload/balancete").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<UploadBalanceSheet />, <TablePageSkeleton />)}
        />
      ))}

      {/* Upload Orçamento */}
      {withScopes("arquivos/upload/orcamento").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<UploadBudgetSheet />, <TablePageSkeleton />)}
        />
      ))}

      {/* Balancetes */}
      {withScopes("balancetes").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<UploadBalanceSheet />, <TablePageSkeleton />)}
        />
      ))}

      {/* Balancete Data */}
      {withScopes("balancetes/:balanceteId").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<BalanceSheetData />, <DashboardSkeleton />)}
        />
      ))}

      {/* Balancete Detalhado */}
      {withScopes("balancetes/:balanceteId/detalhado").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<BalanceSheetDetailed />, <DashboardSkeleton />)}
        />
      ))}

      {/* Balanço Contábil */}
      {withScopes("balancetes/:balanceteId/balanco-contabil").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<BalanceAssetsLiabilities />, <DashboardSkeleton />)}
        />
      ))}

      {/* Classificação */}
      {withScopes("classificacao").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<ClassificationPage />, <TablePageSkeleton />)}
        />
      ))}

      {/* Balanço Contábil Geral */}
      {withScopes("contabil").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<BalancoContabil />, <DashboardSkeleton />)}
        />
      ))}

      {/* Demonstrações Contábeis */}
      {withScopes("demonstracoes-contabeis").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<BalancoReclassificado />, <DashboardSkeleton />)}
        />
      ))}

      {/* Gestão da Liquidez */}
      {withScopes("resultados/gestao-liquidez").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<GestaoLiquidez />, <DashboardSkeleton />)}
        />
      ))}

      {/* Índices Econômicos */}
      {withScopes("resultados/indices-economicos").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<IndicesEconomicos />, <DashboardSkeleton />)}
        />
      ))}

      {/* CIL e EC */}
      {withScopes("resultados/cil-ec").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<CILeEC />, <DashboardSkeleton />)}
        />
      ))}

      {/* Eficiência Operacional */}
      {withScopes("resultados/eficiencia-operacional").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<EficienciaOperacional />, <DashboardSkeleton />)}
        />
      ))}

      {/* Parâmetros */}
      {withScopes("parametros").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<Params />, <ContentPageSkeleton />)}
        />
      ))}

      {/* Fluxo de Caixa */}
      {withScopes("fluxo-caixa").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<CashFlow />, <DashboardSkeleton />)}
        />
      ))}

      {/* FEVA */}
      {withScopes("eva").map((path) => (
        <Route
          key={path}
          path={path}
          element={withFallback(<AgregadoMensal />, <DashboardSkeleton />)}
        />
      ))}
    </Routes>
  );
};
