import api from './api';

const listUsers = async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

const banUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/ban`);
    return response.data;
};

const listAllNotes = async (params) => {
    const response = await api.get('/admin/notes', { params });
    return response.data;
};

const deleteNoteAsAdmin = async (noteId) => {
    const response = await api.delete(`/admin/notes/${noteId}`);
    return response.data;
};

const adminService = {
    listUsers,
    banUser,
    listAllNotes,
    deleteNoteAsAdmin,
};

export default adminService;
