import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Minus, Check } from 'lucide-react';
import { bookService } from '../services/api';

const CurrentlyReading = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingBook, setUpdatingBook] = useState(null);

  const colors = {
    reading: '#87CEEB',
    primary: '#FD3DB5'
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getCurrentlyReading();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (bookId, newPage) => {
    try {
      setUpdatingBook(bookId);
      await bookService.updateProgress(bookId, newPage);
      fetchBooks();
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Error al actualizar el progreso');
    } finally {
      setUpdatingBook(null);
    }
  };

  const markAsCompleted = async (bookId) => {
    if (window.confirm('¿Terminaste de leer este libro?')) {
      try {
        await bookService.updateStatus(bookId, 'COMPLETED');
        fetchBooks();
        alert('¡Felicidades por terminar el libro! 🎉');
      } catch (error) {
        console.error('Error marking as completed:', error);
        alert('Error al marcar como completado');
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        paddingTop: '6rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '2rem',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: colors.reading
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      paddingTop: '6rem',
      minHeight: '100vh',
      padding: '6rem 2rem 2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <BookOpen size={48} color={colors.reading} />
            <h1 style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: colors.reading,
              margin: 0
            }}>
              Actualmente Leyendo
            </h1>
          </div>
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1.25rem',
            color: '#666'
          }}>
            {books.length} {books.length === 1 ? 'libro' : 'libros'} en progreso
          </p>
        </div>

        {/* Books List */}
        {books.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}>
            <BookOpen size={80} color="#ccc" style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '2rem', color: '#666', marginBottom: '1rem' }}>
              No estás leyendo ningún libro
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#999' }}>
              ¡Empieza un libro desde tu biblioteca!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '2rem'
          }}>
            {books.map(book => (
              <ReadingBookCard
                key={book.id}
                book={book}
                onUpdateProgress={updateProgress}
                onMarkComplete={markAsCompleted}
                isUpdating={updatingBook === book.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ReadingBookCard = ({ book, onUpdateProgress, onMarkComplete, isUpdating }) => {
  const [customPage, setCustomPage] = useState(book.currentPage || 0);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const progress = book.pages ? (book.currentPage / book.pages) * 100 : 0;

  const handleQuickUpdate = (increment) => {
    const newPage = Math.max(0, Math.min((book.currentPage || 0) + increment, book.pages || 0));
    onUpdateProgress(book.id, newPage);
  };

  const handleCustomUpdate = () => {
    const newPage = Math.max(0, Math.min(customPage, book.pages || 0));
    onUpdateProgress(book.id, newPage);
    setShowCustomInput(false);
  };

  return (
    <div style={{
      backgroundColor: '#87CEEB',
      borderRadius: '2rem',
      padding: '2rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      transition: 'all 0.3s'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Book Info */}
        <div>
          {book.coverUrl && (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              style={{
                width: '100%',
                borderRadius: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            />
          )}
          <h2 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            {book.title}
          </h2>
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '1rem'
          }}>
            {book.author}
          </p>
          {book.genre && (
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              color: '#fff',
              fontWeight: '600',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
              {book.genre}
            </span>
          )}
        </div>

        {/* Progress Section */}
        <div>
          {/* Progress Bar */}
          {book.pages && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  Progreso
                </span>
                <span style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  {Math.round(progress)}%
                </span>
              </div>

              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#fff',
                  transition: 'width 0.5s ease',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }} />
              </div>

              <div style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '1rem',
                color: '#fff',
                textAlign: 'center'
              }}>
                {book.currentPage} / {book.pages} páginas
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '1rem'
            }}>
              Actualizar Progreso
            </h3>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <button
                onClick={() => handleQuickUpdate(-10)}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '600',
                  color: '#333',
                  opacity: isUpdating ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)')}
              >
                <Minus size={18} />
                -10 págs
              </button>

              <button
                onClick={() => handleQuickUpdate(10)}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '600',
                  color: '#333',
                  opacity: isUpdating ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)')}
              >
                <Plus size={18} />
                +10 págs
              </button>
            </div>

            {showCustomInput ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={customPage}
                  onChange={(e) => setCustomPage(parseInt(e.target.value) || 0)}
                  min="0"
                  max={book.pages || 0}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '10px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleCustomUpdate}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '600',
                    color: '#333'
                  }}
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomInput(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '600',
                  color: '#333',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
              >
                Página Específica
              </button>
            )}
          </div>

          {/* Mark as Complete */}
          <button
            onClick={() => onMarkComplete(book.id)}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#90EE90',
              color: '#fff',
              border: 'none',
              borderRadius: '15px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Helvetica, Arial, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 15px rgba(144, 238, 144, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Check size={24} />
            Marcar como Completado
          </button>
        </div>
      </div>

      {book.personalNotes && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '1rem'
        }}>
          <h4 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            Mis Notas:
          </h4>
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.6',
            margin: 0
          }}>
            {book.personalNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentlyReading;