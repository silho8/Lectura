import api from './api';

const getMyProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

const updateUserProfile = async (profileData) => {
    // This will be updated to handle multipart/form-data if an avatar is included
    const response = await api.put('/users/me', profileData);
    return response.data;
};

const updateUserTheme = async (theme) => {
    const response = await api.put('/users/me/theme', { theme });
    return response.data;
};

const userService = {
    getMyProfile,
    updateUserProfile,
    updateUserTheme,
};

export default userService;
