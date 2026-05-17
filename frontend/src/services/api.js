import axios from 'axios';

const API_URL = 'https://notes-web-ykfv.onrender.com/api/notes';
const CAT_API_URL = 'http://localhost:8080/api/categories'; // <-- Revisá que esté esta línea

export const getNotes = () => axios.get(API_URL);
export const getArchivedNotes = () => axios.get(`${API_URL}/archived`);
export const createNote = (note) => axios.post(API_URL, note);
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
export const toggleArchive = (id) => axios.patch(`${API_URL}/${id}/archive`);
export const updateNote = (id, note) => axios.put(`${API_URL}/${id}`, note);

// --- SECCIÓN DE CATEGORÍAS (Asegurate de que tengan el export) ---
export const getCategories = () => axios.get(CAT_API_URL);
export const createCategory = (category) => axios.post(CAT_API_URL, category);
export const getNotesByCategory = (id) => axios.get(`${API_URL}/category/${id}`);

export const updateCategory = (id, category) => axios.put(`${CAT_API_URL}/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${CAT_API_URL}/${id}`);
export const login = (credentials) => axios.post('https://notes-web-ykfv.onrender.com/api/auth/login', credentials);
export const register = (credentials) => axios.post('https://notes-web-ykfv.onrender.com/api/auth/register', credentials);