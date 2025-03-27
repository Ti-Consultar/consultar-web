import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../../landingPage';
import { Authentication } from '../../Features/Authentication';

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Authentication />} />
            </Routes>
        </>
    )
}