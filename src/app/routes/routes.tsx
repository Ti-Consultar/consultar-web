import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../../landingPage';
import { Authentication } from '../../Features/Authentication';
import { MainHome } from '../../Features/Home';

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Authentication />} />
                <Route path="/inicio" element={<MainHome />} />
            </Routes>
        </>
    )
}