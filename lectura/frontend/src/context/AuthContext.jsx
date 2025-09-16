import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/users/me');
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // This effect runs on initial load to check if a user session exists
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    const signup = async (credentials) => {
        try {
            const data = await authService.signup(credentials);
            // After signup, we get a token but also need to set the user state
            setUser(data.user);
            // The backend should also set the cookie upon signup, or we login right after.
            // The current backend login sets the cookie, but signup only returns a token.
            // I will adjust this later. For now, this sets the client state.
            return data;
        } catch (error) {
            setUser(null);
            throw error;
        }
    }

    const logout = async () => {
        // Client-side logout
        setUser(null);
        // We'd also call a backend endpoint if it existed to clear the HttpOnly cookie
    };

    const value = {
        user,
        loading,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
