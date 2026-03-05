import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/AuthContext';

// Customer App
import CustomerApp from './apps/customer/CustomerApp';
// Technician App
import TechnicianApp from './apps/technician/TechnicianApp';
// Admin App
import AdminApp from './apps/admin/AdminApp';
// Shared Auth
import LoginPage from './apps/customer/pages/LoginPage';
import LandingPage from './apps/customer/pages/LandingPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};

const RoleRouter = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-center" style={{ minHeight: '100vh' }}><div className="spinner"></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'technician') return <Navigate to="/technician" replace />;
    return <Navigate to="/customer" replace />;
};

const LoginRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;
    return <LoginPage />;
};

import ErrorBoundary from './shared/ErrorBoundary';

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginRedirect />} />
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={<RoleRouter />} />

                        {/* Customer Routes */}
                        <Route path="/customer/*" element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerApp />
                            </ProtectedRoute>
                        } />

                        {/* Technician Routes */}
                        <Route path="/technician/*" element={
                            <ProtectedRoute allowedRoles={['technician']}>
                                <TechnicianApp />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/*" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminApp />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    );
}
