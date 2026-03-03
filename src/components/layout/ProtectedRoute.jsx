import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, hasRole, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some((role) => hasRole(role));
        if (!hasRequiredRole) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                    <h1>Access Denied</h1>
                    <p>You do not have permission to view this page.</p>
                </div>
            );
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
