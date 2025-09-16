import api from './api';

const signup = async (credentials) => {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
};

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

const logout = async () => {
    // In a stateless JWT setup, logout is handled client-side.
    // If we had a /logout endpoint to invalidate a server-side session, we'd call it here.
    // For HttpOnly cookies, we can't remove it from the client, so a backend endpoint is best.
    // Let's assume we'll add one later. For now, this is a client-side only action.
    return Promise.resolve();
};

const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
};

const authService = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
};

export default authService;
