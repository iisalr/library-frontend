import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';

const AddBookModal = ({ isOpen, onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    coverUrl: '',
    description: '',
    pages: '',
    language: 'Español',
    publisher: '',
    publicationYear: '',
    genre: '',
    status: 'WISHLIST',
    rating: '',
    personalNotes: ''
  });

  const colors = {
    primary: '#FD3DB5',
    secondary: '#8FD9FB',
    accent: '#FFEE8C',
    info: '#0066FF'
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title || !formData.author) {
      alert('Por favor completa al menos el título y autor');
      return;
    }

    // Preparar datos para enviar
    const bookData = {
      ...formData,
      pages: formData.pages ? parseInt(formData.pages) : null,
      publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null
    };

    // Llamar al callback con los datos
    onBookAdded(bookData);
    
    // Resetear formulario
    setFormData({
      title: '',
      author: '',
      isbn: '',
      coverUrl: '',
      description: '',
      pages: '',
      language: 'Español',
      publisher: '',
      publicationYear: '',
      genre: '',
      status: 'WISHLIST',
      rating: '',
      personalNotes: ''
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem',
      animation: 'fadeIn 0.3s'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <BookPlus size={32} />
            Agregar Nuevo Libro
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={28} color="#333" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Título */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Cien años de soledad"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Autor */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Ej: Gabriel García Márquez"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Grid de 2 columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Género */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  Género
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Ej: Ficción"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    fontSize: '1rem',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Páginas */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  Páginas
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="Ej: 471"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    fontSize: '1rem',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="WISHLIST">Quiero Leer</option>
                <option value="READING">Leyendo</option>
                <option value="COMPLETED">Completado</option>
                <option value="DNF">Abandonado</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                placeholder="Ej: 4.5"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Breve resumen del libro..."
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* URL de portada */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                URL de Portada
              </label>
              <input
                type="url"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/portada.jpg"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Notas personales */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Notas Personales
              </label>
              <textarea
                name="personalNotes"
                value={formData.personalNotes}
                onChange={handleChange}
                rows="2"
                placeholder="Tus pensamientos sobre este libro..."
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Helvetica, Arial, sans-serif',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Helvetica, Arial, sans-serif',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(253, 61, 181, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Agregar Libro
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddBookModal;