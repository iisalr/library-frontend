import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import BookCard from '../components/BookCard';
import AddBookModal from '../components/AddBookModal';
import EditBookModal from '../components/EditBookModal';
import { bookService } from '../services/api';

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const colors = ['#FD3DB5', '#8FD9FB', '#FFEE8C', '#0066FF'];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, filterStatus]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error al cargar los libros. Asegúrate de que el backend esté corriendo en http://localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(book => book.status === filterStatus);
    }

    setFilteredBooks(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este libro?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error al eliminar el libro');
      }
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (bookId, bookData) => {
    try {
      await bookService.updateBook(bookId, bookData);
      setIsEditModalOpen(false);
      setSelectedBook(null);
      fetchBooks();
      alert('¡Libro actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error al actualizar el libro');
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      await bookService.createBook(bookData);
      setIsModalOpen(false);
      fetchBooks();
      alert('¡Libro agregado exitosamente!');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error al agregar el libro');
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
          color: colors[0]
        }}>
          Cargando libros...
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
        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '3rem',
            fontWeight: 'bold',
            color: colors[1]
          }}>
            Mi Biblioteca
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: colors[0],
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'Helvetica, Arial, sans-serif',
              boxShadow: '0 4px 15px rgba(253, 61, 181, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={24} />
            Agregar Libro
          </button>
        </div>

        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1',
            minWidth: '300px',
            position: 'relative'
          }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }}
            />
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                fontSize: '1rem',
                border: '2px solid #ddd',
                borderRadius: '50px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = colors[0]}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <Filter size={20} color={colors[3]} />
            {['ALL', 'WISHLIST', 'READING', 'COMPLETED', 'DNF'].map((status) => {
              const labels = {
                ALL: 'Todos',
                WISHLIST: 'Quiero Leer',
                READING: 'Leyendo',
                COMPLETED: 'Completados',
                DNF: 'Abandonados'
              };

              const statusColors = {
                ALL: colors[3],
                WISHLIST: '#FFB6C1',
                READING: '#87CEEB',
                COMPLETED: '#90EE90',
                DNF: '#FFB347'
              };

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: filterStatus === status ? statusColors[status] : 'transparent',
                    color: filterStatus === status ? '#fff' : '#333',
                    border: `2px solid ${statusColors[status]}`,
                    borderRadius: '50px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = statusColors[status];
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#333';
                    }
                  }}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{
          marginBottom: '2rem',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '1.125rem',
          color: '#666'
        }}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'libro' : 'libros'} encontrado{filteredBooks.length === 1 ? '' : 's'}
        </div>

        {filteredBooks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}>
            <h2 style={{ fontSize: '2rem', color: '#666', marginBottom: '1rem' }}>
              No hay libros aquí todavía
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#999' }}>
              ¡Agrega tu primer libro y empieza tu biblioteca!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onClick={() => alert(`Ver detalles de: ${book.title}`)}
              />
            ))}
          </div>
        )}
      </div>

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleAddBook}
      />

      <EditBookModal
        isOpen={isEditModalOpen}
        book={selectedBook}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        onBookUpdated={handleUpdateBook}
      />
    </div>
  );
};

export default MyLibrary;