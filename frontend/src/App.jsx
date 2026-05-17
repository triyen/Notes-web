import { useEffect, useState } from 'react'
import {
  getNotes, getArchivedNotes, createNote, deleteNote, toggleArchive, updateNote, getCategories, createCategory, getNotesByCategory, login, register,
  updateCategory, deleteCategory
} from './services/api'

function App() {
  // 1. ESTADOS
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [isRegisterMode, setIsRegisterMode] = useState(false) // <-- Controla si muestra Login o Registro
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState({ title: '', content: '', categoryId: '' })
  const [viewArchived, setViewArchived] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null) 

  // 2. FUNCIONES DE CARGA
  const fetchNotes = async () => {
    try {
      let response;
      if (selectedCategory) {
        response = await getNotesByCategory(selectedCategory)
      } else {
        response = viewArchived ? await getArchivedNotes() : await getNotes()
      }
      setNotes(response.data)
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  // 3. EFECTOS
  useEffect(() => {
    fetchNotes()
  }, [viewArchived])

  useEffect(() => {
    fetchCategories()
  }, [viewArchived, selectedCategory])

  // 4. HANDLERS (ACCIONES)
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, { name: newCategoryName })
        setEditingCategoryId(null)
      } else {
        await createCategory({ name: newCategoryName })
      }
      setNewCategoryName('')
      fetchCategories()
      fetchNotes() 
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return alert("Title is required");

    const noteToSend = {
      title: newNote.title,
      content: newNote.content,
      categories: newNote.categoryId ? [{ id: parseInt(newNote.categoryId) }] : []
    };

    try {
      if (editingId) {
        await updateNote(editingId, noteToSend);
        setEditingId(null);
      } else {
        await createNote(noteToSend);
      }

      setNewNote({ title: '', content: '', categoryId: '' });
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const response = await login(loginCredentials)
      if (response.data.success) {
        setIsLoggedIn(true)
        localStorage.setItem('isLoggedIn', 'true')
        setLoginCredentials({ username: '', password: '' })
      }
    } catch (error) {
      setLoginError('Invalid username or password. Try admin / admin123')
    }
  }

  // NUEVO: Handler para registrar usuarios en Neon de forma segura
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginCredentials.username.trim() || !loginCredentials.password.trim()) {
      return setLoginError('Username and password are required')
    }
    try {
      const response = await register(loginCredentials)
      if (response.data.success) {
        alert("¡Usuario creado, fiera! Ya podés iniciar sesión.")
        setIsRegisterMode(false) // Lo mandamos al Login automáticamente
        setLoginError('')
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setLoginError(error.response.data.message)
      } else {
        setLoginError('Error registering user. Username might already exist.')
      }
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  const handleEdit = (note) => {
    setEditingId(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      categoryId: note.categories && note.categories.length > 0 ? note.categories[0].id : ''
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id)
      fetchNotes()
    }
  }

  const handleArchive = async (id) => {
    await toggleArchive(id)
    fetchNotes()
  }

  const handleStartEditCategory = (cat) => {
    setEditingCategoryId(cat.id)
    setNewCategoryName(cat.name)
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure? Deleting this tag will remove it from all notes.")) {
      try {
        await deleteCategory(id)
        fetchCategories()
        fetchNotes()
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 5. RENDEREADO CONDICIONAL DINÁMICO
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'Arial', background: '#222', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
        <h2>{isRegisterMode ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            value={loginCredentials.username}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
          />
          {loginError && <p style={{ color: '#d9534f', fontSize: '14px', margin: '0' }}>{loginError}</p>}
          <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Botoncito sutil para cambiar entre Login y Registro */}
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => { setIsRegisterMode(!isRegisterMode); setLoginError(''); }} 
            style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isRegisterMode ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    )
  }

  // Rendereado original de la app con sesión iniciada
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: 'center' }}>My Notes</h1>

      {/* CREATION/EDITION FORM */}
      <div style={{ background: '#222', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Note title..."
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444' }}
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />

          <textarea
            placeholder="Write your note here..."
            style={{
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #444',
              minHeight: '80px',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              resize: 'both',
              display: 'block'
            }}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <select
            value={newNote.categoryId}
            onChange={(e) => setNewNote({ ...newNote, categoryId: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white', marginBottom: '10px' }}
          >
            <option value="">No Tag / Select a Tag...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editingId ? 'Update Note' : 'Save Note'}
          </button>
        </form>
      </div>

      {/* FILTER: VIEW TOGGLE BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>{viewArchived ? 'Archived Notes' : 'Active Notes'}</h2>
        <button
          onClick={() => setViewArchived(!viewArchived)}
          style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', background: viewArchived ? '#f0ad4e' : '#5bc0de', color: 'white', border: 'none' }}
        >
          {viewArchived ? 'View Active' : 'View Archived'}
        </button>
      </div>

      <hr />

      {/* SECCIÓN DE FILTROS Y CATEGORÍAS */}
      <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxSizing: 'border-box' }}>
        <div style={{ boxSizing: 'border-box' }}>
          <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Search by Title:</label>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', boxSizing: 'border-box' }}>
          <div style={{ flex: '1', minWidth: '150px', boxSizing: 'border-box' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '150px', boxSizing: 'border-box' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>
              {editingCategoryId ? 'Edit Tag Name:' : 'Create New Tag:'}
            </label>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '5px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Tag name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ flex: '1', minWidth: '0', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '8px 12px', background: editingCategoryId ? '#f0ad4e' : '#5bc0de', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {editingCategoryId ? 'Save' : 'Add'}
              </button>
              {editingCategoryId && (
                <button type="button" onClick={() => { setEditingCategoryId(null); setNewCategoryName(''); }} style={{ padding: '8px 12px', background: '#888', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  X
                </button>
              )}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '100px', overflowY: 'auto', background: '#222', padding: '5px', borderRadius: '4px' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 5px', background: '#333', borderRadius: '3px', fontSize: '13px' }}>
                  <span style={{ color: '#fff' }}>{cat.name}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="button" onClick={() => handleStartEditCategory(cat)} style={{ background: 'transparent', border: 'none', color: '#5bc0de', cursor: 'pointer', padding: '0 2px' }}>✏️</button>
                    <button type="button" onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'transparent', border: 'none', color: '#d9534f', cursor: 'pointer', padding: '0 2px' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NOTES LIST */}
      <div style={{ marginTop: '20px' }}>
        {filteredNotes.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No notes to display.</p>}

        {filteredNotes.map(note => (
          <div key={note.id} style={{ background: '#333', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '5px solid #4CAF50' }}>
            <h3 style={{ marginTop: '0' }}>{note.title}</h3>
            <p style={{ color: '#ccc' }}>{note.content}</p>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
              {note.categories && note.categories.map(cat => (
                <span key={cat.id} style={{ background: '#5bc0de', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {cat.name}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={() => handleArchive(note.id)}
                style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #888', background: 'transparent', color: 'white', cursor: 'pointer' }}
              >
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => handleEdit(note)}
                style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #5bc0de', background: 'transparent', color: '#5bc0de', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', background: '#d9534f', color: 'white', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;