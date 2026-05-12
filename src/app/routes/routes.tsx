import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { hasValidAuthToken } from "../../utils/authToken";

/* Landing page e rotas simples */
const Home = lazy(() => import("../../landingPage"));
const ForgotPassword = lazy(
  () => import("../../Features/Authentication/forgot-password"),
);
const PasswordSent = lazy(
  () => import("../../Features/Authentication/forgot-password/password-sent"),
);
const Authentication = lazy(() => import("../../Features/Authentication"));

/* Perfil */
const ProfileInfo = lazy(() => import("../../Features/Profile"));
const ProfileSecurity = lazy(
  () => import("../../Features/Profile/ProfileSecurity"),
);
const ProfileCustomizing = lazy(
  () => import("../../Features/Profile/ProfileCustomizing"),
);
const UsersSettings = lazy(
  () => import("../../Features/Profile/UsersSettings"),
);

/* Grupos / Empresas */
const Groups = lazy(() => import("../../Features/Groups"));
const Companies = lazy(() => import("../../Features/Companies"));

/* Balancete, Contábil, DRE */
const BalanceSheetData = lazy(
  () => import("../../Features/ChartAccounts/BalanceSheetData"),
);
const BalanceSheetDetailed = lazy(
  () => import("../../Features/ChartAccounts/BalanceSheetDetailed"),
);
const BalanceAssetsLiabilities = lazy(
  () => import("../../Features/ChartAccounts/BalanceAssetsLiabilities"),
);

const BalancoContabil = lazy(
  () => import("../../Features/BalanceSheet/BalanceSheet"),
);
const BalancoReclassificado = lazy(
  () => import("../../Features/BalanceSheet/BalancoReclassificado"),
);
const BalancoPorMarca = lazy(
  () => import("../../Features/BalanceSheet/BalancoPorMarca"),
);

/* Classificação */
const ClassificationPage = lazy(() => import("../../Features/Classification"));

/* Resultados */
const GestaoLiquidez = lazy(
  () => import("../../Features/Results/GestaoLiquidez"),
);
const IndicesEconomicos = lazy(
  () => import("../../Features/Results/IndicesEconomicos"),
);
const CILeEC = lazy(() => import("../../Features/Results/CILeEC"));
const EficienciaOperacional = lazy(
  () => import("../../Features/Results/EficienciaOperacional"),
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
  () => import("../../Features/Upload/UploadBalanceSheet"),
);
const UploadBudgetSheet = lazy(
  () => import("../../Features/Upload/UploadBudgetSheet"),
);

const BalanceColumnMapping = lazy(
  () => import("../../Features/Upload/BalanceColumnMapping"),
);

/* Not Found */
const NotFoundPage = lazy(() => import("../../Features/NotFoundPage"));

const Branches = lazy(() => import("../../Features/Companies/Branches"));

/* Helper */
import { withScopes } from "./helper";

const ElectronStartRoute = () => {
  return <Navigate to={hasValidAuthToken() ? "/grupos" : "/login"} replace />;
};

export const AppRoutes = () => {
  const isElectron = import.meta.env.VITE_ELECTRON === "true";

  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/"
          element={isElectron ? <ElectronStartRoute /> : <Home />}
        />
        <Route path="/perfil/informacoes" element={<ProfileInfo />} />
        <Route path="/perfil/seguranca" element={<ProfileSecurity />} />
        <Route path="/perfil/personalizacao" element={<ProfileCustomizing />} />
        <Route path="/users" element={<UsersSettings />} />

        <Route path="/login" element={<Authentication />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route
          path="/recuperar-senha/senha-enviada"
          element={<PasswordSent />}
        />

        <Route path="/dashboard" element={<MrpHome />} />

        <Route path="/grupos" element={<Groups />} />
        <Route path="/grupos/:groupId/empresas" element={<Companies />} />
        <Route
          path="/grupos/:groupId/empresas/:companyId/filiais"
          element={<Companies />}
        />
        <Route
          path="/grupos/:groupId/empresas/:companyId/filiais/:subCompanyId"
          element={<Branches />}
        />

        {/* Upload Balancete */}
        {withScopes("arquivos/upload/balancete").map((path) => (
          <Route key={path} path={path} element={<UploadBalanceSheet />} />
        ))}

        {/* Mapeamento Balancete */}
        {withScopes("arquivos/upload/balancete/colunas").map((path) => (
          <Route key={path} path={path} element={<BalanceColumnMapping />} />
        ))}

        {/* Upload Orçamento */}
        {withScopes("arquivos/upload/orcamento").map((path) => (
          <Route key={path} path={path} element={<UploadBudgetSheet />} />
        ))}

        {/* Balancetes */}
        {withScopes("balancetes").map((path) => (
          <Route key={path} path={path} element={<UploadBalanceSheet />} />
        ))}

        {/* Balancete Data */}
        {withScopes("balancetes/:balanceteId").map((path) => (
          <Route key={path} path={path} element={<BalanceSheetData />} />
        ))}

        {/* Balancete Detalhado */}
        {withScopes("balancetes/:balanceteId/detalhado").map((path) => (
          <Route key={path} path={path} element={<BalanceSheetDetailed />} />
        ))}

        {/* Balanço Contábil */}
        {withScopes("balancetes/:balanceteId/balanco-contabil").map((path) => (
          <Route
            key={path}
            path={path}
            element={<BalanceAssetsLiabilities />}
          />
        ))}

        {/* Classificação */}
        {withScopes("classificacao").map((path) => (
          <Route key={path} path={path} element={<ClassificationPage />} />
        ))}

        {/* Balanço Contábil Geral */}
        {withScopes("contabil").map((path) => (
          <Route key={path} path={path} element={<BalancoContabil />} />
        ))}

        {/* Demonstrações Contábeis */}
        {withScopes("demonstracoes-contabeis").map((path) => (
          <Route key={path} path={path} element={<BalancoReclassificado />} />
        ))}

        {/* Demonstrações por Marca */}
        {withScopes("demonstracoes-marcas").map((path) => (
          <Route key={path} path={path} element={<BalancoPorMarca />} />
        ))}

        {/* Gestão da Liquidez */}
        {withScopes("resultados/gestao-liquidez").map((path) => (
          <Route key={path} path={path} element={<GestaoLiquidez />} />
        ))}

        {/* Índices Econômicos */}
        {withScopes("resultados/indices-economicos").map((path) => (
          <Route key={path} path={path} element={<IndicesEconomicos />} />
        ))}

        {/* CIL e EC */}
        {withScopes("resultados/cil-ec").map((path) => (
          <Route key={path} path={path} element={<CILeEC />} />
        ))}

        {/* Eficiência Operacional */}
        {withScopes("resultados/eficiencia-operacional").map((path) => (
          <Route key={path} path={path} element={<EficienciaOperacional />} />
        ))}

        {/* Parâmetros */}
        {withScopes("parametros").map((path) => (
          <Route key={path} path={path} element={<Params />} />
        ))}

        {/* Fluxo de Caixa */}
        {withScopes("fluxo-caixa").map((path) => (
          <Route key={path} path={path} element={<CashFlow />} />
        ))}

        {/* FEVA */}
        {withScopes("eva").map((path) => (
          <Route key={path} path={path} element={<AgregadoMensal />} />
        ))}
      </Routes>
    </Suspense>
  );
};
