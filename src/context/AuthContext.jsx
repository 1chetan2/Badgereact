import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);

                // Extract role properly depending on how the given backend formats claims
                const roleClaimUrl = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
                const role = decodedUser.role || decodedUser[roleClaimUrl] || null;

                setUser({
                    ...decodedUser,
                    role: role,
                });
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Helper functionality for role-based access checks
    const isAuthenticated = !!token && !!user;

    // Checks if the user has a specific role (handles single string or array of roles)
    const hasRole = (role) => {
        if (!user || (!user.role && !user.roles)) return false;
        const userRoles = user.role || user.roles;

        if (Array.isArray(userRoles)) {
            return userRoles.includes(role);
        }
        return userRoles === role;
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
