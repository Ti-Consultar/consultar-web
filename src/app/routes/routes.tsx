import { Route, Routes } from "react-router-dom";
import { Home } from "../../landingPage";
import { ForgotPassword } from "../../Features/Authentication/forgot-password";
import { PasswordSent } from "../../Features/Authentication/forgot-password/password-sent";
import { Groups } from "../../Features/Groups";
import { Companies } from "../../Features/Companies";
import { Branches } from "../../Features/Companies/Branches";
import { SubCompanies } from "../../Features/SubCompanies";
import { ProfileInfo } from "../../Features/Profile";
import { Authentication } from "../../Features/Authentication";
import { ProfileSecurity } from "../../Features/Profile/ProfileSecurity";
import { BalanceSheet } from "../../Features/ChartAccounts/BalanceSheetList";
import { BalanceSheetData } from "../../Features/ChartAccounts/BalanceSheetData";
import { BalanceSheetDetailed } from "../../Features/ChartAccounts/BalanceSheetDetailed";
import { BalanceAssetsLiabilities } from "../../Features/ChartAccounts/BalanceAssetsLiabilities";
import { ClassificationPage } from "../../Features/Classification";
import { BalancoContabil } from "../../Features/BalanceSheet/BalanceSheet";
import { BalancoReclassificado } from "../../Features/BalanceSheet/BalancoReclassificado";
import { withScopes } from "./helper";
import { GestaoLiquidez } from "../../Features/Results/GestaoLiquidez";
import { IndicesEconomicos } from "../../Features/Results/IndicesEconomicos";
import { CILeEC } from "../../Features/Results/CILeEC";
import { EficienciaOperacional } from "../../Features/Results/EficienciaOperacional";
import { MrpHome } from "../../Features/Home";

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
        <Route path="/" element={<Home />} />

        <Route path="/perfil/informacoes" element={<ProfileInfo />} />
        <Route path="/perfil/seguranca" element={<ProfileSecurity />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route
          path="/recuperar-senha/senha-enviada"
          element={<PasswordSent />}
        />

        <Route path="/dashboard" element={<MrpHome />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path={`/grupos/:groupId/empresas`} element={<Companies />} />
        <Route
          path={`/grupos/:groupId/empresas/:companyId/filiais`}
          element={<Branches />}
        />
        <Route
          path={`/grupos/:groupId/empresas/:companyId/filiais/:subCompanyId`}
          element={<SubCompanies />}
        />

        {/* plano de contas */}
        {withScopes("arquivos/upload/balancete").map((path) => (
          <Route key={path} path={path} element={<BalanceSheet />} />
        ))}

        {/* balancetes */}
        {withScopes("balancetes").map((path) => (
          <Route key={path} path={path} element={<BalanceSheet />} />
        ))}

        {/* balancetes data */}
        {withScopes("balancetes/:balanceteId").map((path) => (
          <Route key={path} path={path} element={<BalanceSheetData />} />
        ))}

        {/* balancetes detalhado */}
        {withScopes("balancetes/:balanceteId/detalhado").map((path) => (
          <Route key={path} path={path} element={<BalanceSheetDetailed />} />
        ))}

        {/* balanço contábil */}
        {withScopes("balancetes/:balanceteId/balanco-contabil").map((path) => (
          <Route
            key={path}
            path={path}
            element={<BalanceAssetsLiabilities />}
          />
        ))}

        {/* classificação */}
        {withScopes("classificacao").map((path) => (
          <Route key={path} path={path} element={<ClassificationPage />} />
        ))}

        {/* balanço contábil geral */}
        {withScopes("contabil").map((path) => (
          <Route key={path} path={path} element={<BalancoContabil />} />
        ))}

        {/* demonstrações contábeis */}
        {withScopes("demonstracoes-contabeis").map((path) => (
          <Route key={path} path={path} element={<BalancoReclassificado />} />
        ))}

        {/* RESULTADOS */}
        {/* demonstrações contábeis */}
        {withScopes("resultados/gestao-liquidez").map((path) => (
          <Route key={path} path={path} element={<GestaoLiquidez />} />
        ))}

        {/* Indíces econômicos */}
        {withScopes("resultados/indices-economicos").map((path) => (
          <Route key={path} path={path} element={<IndicesEconomicos />} />
        ))}

        {/* CIL e EC */}
        {withScopes("resultados/cil-ec").map((path) => (
          <Route key={path} path={path} element={<CILeEC />} />
        ))}

        {/* Eficiencia Operacional */}
        {withScopes("resultados/eficiencia-operacional").map((path) => (
          <Route key={path} path={path} element={<EficienciaOperacional />} />
        ))}
      </Routes>
    </>
  );
};
