import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const initAuth = useCallback(async () => {
        const token = localStorage.getItem('es_access_token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.data.user);
            } catch {
                localStorage.removeItem('es_access_token');
                localStorage.removeItem('es_refresh_token');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => { initAuth(); }, [initAuth]);

    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem('es_access_token', accessToken);
        localStorage.setItem('es_refresh_token', refreshToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('es_access_token');
        localStorage.removeItem('es_refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
