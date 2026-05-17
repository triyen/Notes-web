import axios from 'axios';

// La URL base de tu servidor en la nube
const API_BASE = 'https://notes-web-ykfv.onrender.com/api';

// ENDPOINTS DE NOTAS
export const getNotes = () => axios.get(`${API_BASE}/notes`);
export const getArchivedNotes = () => axios.get(`${API_BASE}/notes/archived`);
export const createNote = (note) => axios.post(`${API_BASE}/notes`, note);
export const updateNote = (id, note) => axios.put(`${API_BASE}/notes/${id}`, note);
export const deleteNote = (id) => axios.delete(`${API_BASE}/notes/${id}`);
export const toggleArchive = (id) => axios.put(`${API_BASE}/notes/${id}/archive`);
export const getNotesByCategory = (catId) => axios.get(`${API_BASE}/notes/category/${catId}`);

// ENDPOINTS DE CATEGORÍAS (TAGS)
export const getCategories = () => axios.get(`${API_BASE}/categories`);
export const createCategory = (category) => axios.post(`${API_BASE}/categories`, category);
export const updateCategory = (id, category) => axios.put(`${API_BASE}/categories/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${API_BASE}/categories/${id}`);

// ENDPOINTS DE AUTENTICACIÓN
export const login = (credentials) => axios.post(`${API_BASE}/auth/login`, credentials);
export const register = (credentials) => axios.post(`${API_BASE}/auth/register`, credentials);