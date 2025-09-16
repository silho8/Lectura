import api from './api';

const createNote = async (formData) => {
    // FormData is needed for multipart/form-data (file uploads)
    const response = await api.post('/notes', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const getNotes = async (params) => {
    // params can include { page, limit, q, visibility }
    const response = await api.get('/notes', { params });
    return response.data;
};

const getNoteById = async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
};

const updateNote = async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
};

const deleteNote = async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
};

const downloadFile = (fileId) => {
    // This will trigger a download in the browser
    window.open(`${api.defaults.baseURL}/notes/files/${fileId}/download`, '_blank');
};

const getFilePreviewUrl = (fileId) => {
    return `${api.defaults.baseURL}/notes/files/${fileId}/preview`;
};


const noteService = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    downloadFile,
    getFilePreviewUrl,
};

export default noteService;
