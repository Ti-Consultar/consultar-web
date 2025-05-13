import { Route, Routes } from 'react-router-dom';
import { Home } from '../../landingPage';
import { Authentication } from '../../Features/Authentication';
import { ForgotPassword } from '../../Features/Authentication/forgot-password';
import { PasswordSent } from '../../Features/Authentication/forgot-password/password-sent';
import { MrpHome } from '../../Features/Home';
import { Companies } from '../../Features/Companies';
import { Branches } from '../../Features/Companies/Branches';
import { SubCompanies } from '../../Features/SubCompanies';

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* <Route path="*" element={<Navigate to="/" />} /> */}
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Authentication />} />
                <Route path="/recuperar-senha" element={<ForgotPassword />} />
                <Route path="/recuperar-senha/senha-enviada" element={<PasswordSent />} />

                <Route path="/grupos" element={<MrpHome />} />
                <Route path={`/grupos/:groupId/empresas`} element={<Companies />} />
                <Route path={`/grupos/:groupId/empresas/:companyId/filiais`} element={<Branches />} />
                <Route path={`/grupos/:groupId/empresas/:companyId/filiais/:subCompanyId`} element={<SubCompanies />} />
            </Routes>
        </>
    )
}