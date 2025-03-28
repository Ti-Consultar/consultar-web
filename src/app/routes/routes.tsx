import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../../landingPage';
import { Authentication } from '../../Features/Authentication';
import { ForgotPassword } from '../../Features/Authentication/forgot-password';
import { PasswordSent } from '../../Features/Authentication/forgot-password/password-sent';
import { MrpHome } from '../../Features/Home';

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Authentication />} />
                <Route path="/recuperar-senha" element={<ForgotPassword />} />
                <Route path="/recuperar-senha/senha-enviada" element={<PasswordSent />} />

                <Route path="/home" element={<MrpHome />} />
            </Routes>
        </>
    )
}