import { Route, Routes } from "react-router-dom";
import { Home } from "../../landingPage";
import { ForgotPassword } from "../../Features/Authentication/forgot-password";
import { PasswordSent } from "../../Features/Authentication/forgot-password/password-sent";
import { MrpHome } from "../../Features/Home";
import { Companies } from "../../Features/Companies";
import { Branches } from "../../Features/Companies/Branches";
import { SubCompanies } from "../../Features/SubCompanies";
import { ProfileInfo } from "../../Features/Profile";
import { Authentication } from "../../Features/Authentication";
import { ProfileSecurity } from "../../Features/Profile/ProfileSecurity";
import { UploadBalanceSheet } from "../../Features/ChartAccounts/UploadBalanceSheet";
import { BalanceSheet } from "../../Features/ChartAccounts/BalanceSheetList";
import { BalanceSheetData } from "../../Features/ChartAccounts/BalanceSheetData";
import { BalanceSheetDetailed } from "../../Features/ChartAccounts/BalanceSheetDetailed";
import { BalanceAssetsLiabilities } from "../../Features/ChartAccounts/BalanceAssetsLiabilities";
import { ClassificationPage } from "../../Features/Classification";

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

        <Route path="/grupos" element={<MrpHome />} />
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
        <Route
          path="grupos/:groupId/plano-de-contas"
          element={<UploadBalanceSheet />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/plano-de-contas"
          element={<UploadBalanceSheet />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/plano-de-contasplano-de-contas"
          element={<UploadBalanceSheet />}
        />
        {/* balancetes */}
        <Route path="grupos/:groupId/balancetes" element={<BalanceSheet />} />
        <Route
          path="grupos/:groupId/empresas/:companyid/balancetes"
          element={<BalanceSheet />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/balancetes"
          element={<BalanceSheet />}
        />

        {/* balancetes data */}
        <Route
          path="grupos/:groupId/balancetes/:balanceteId"
          element={<BalanceSheetData />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/balancetes/:balanceteId"
          element={<BalanceSheetData />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/balancetes/:balanceteId"
          element={<BalanceSheetData />}
        />

        {/* balancetes balanço detalhado */}
        <Route
          path="grupos/:groupId/balancetes/:balanceteId/detalhado"
          element={<BalanceSheetDetailed />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/balancetes/:balanceteId/detalhado"
          element={<BalanceSheetDetailed />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/balancetes/:balanceteId/detalhado"
          element={<BalanceSheetDetailed />}
        />

        {/* Balanço contábil */}
        <Route
          path="grupos/:groupId/balancetes/:balanceteId/balanco-contabil"
          element={<BalanceAssetsLiabilities />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/balancetes/:balanceteId/balanco-contabil"
          element={<BalanceAssetsLiabilities />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/balancetes/:balanceteId/balanco-contabil"
          element={<BalanceAssetsLiabilities />}
        />

        {/* upload - balancete */}
        <Route
          path="grupos/:groupId/plano-de-contas/:balanceteId/upload"
          element={<UploadBalanceSheet />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/plano-de-contas/:balanceteId/upload"
          element={<UploadBalanceSheet />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/plano-de-contas/:balanceteId/upload"
          element={<UploadBalanceSheet />}
        />

        {/* upload - balancete */}
        <Route
          path="grupos/:groupId/classificacao"
          element={<ClassificationPage />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/classificacao"
          element={<ClassificationPage />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/subcompanyid/classificacao"
          element={<ClassificationPage />}
        />

        {/* upload - balanço patrimonial contábil */}
        <Route
          path="grupos/:groupId/contabil"
          element={<ClassificationPage />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/contabil"
          element={<ClassificationPage />}
        />
        <Route
          path="grupos/:groupId/empresas/:companyid/filiais/subcompanyid/contabil"
          element={<ClassificationPage />}
        />
      </Routes>
    </>
  );
};
