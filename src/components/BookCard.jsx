import React from 'react';
import { Star, Trash2, Edit, BookOpen } from 'lucide-react';

const BookCard = ({ book, onDelete, onEdit, onClick }) => {
  const statusColors = {
    WISHLIST: '#FFB6C1',
    READING: '#87CEEB',
    COMPLETED: '#90EE90',
    DNF: '#FFB347'
  };

  const statusLabels = {
    WISHLIST: 'Quiero Leer',
    READING: 'Leyendo',
    COMPLETED: 'Completado',
    DNF: 'Abandonado'
  };

  const getCardHeight = () => {
    if (book.description && book.description.length > 100) return '400px';
    if (book.pages && book.pages > 400) return '380px';
    return '350px';
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: statusColors[book.status] || '#f8f8f8',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        height: getCardHeight(),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
    >
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Helvetica, Arial, sans-serif'
      }}>
        {statusLabels[book.status]}
      </div>

      {/* Book Cover or Icon */}
      <div style={{
        width: '100%',
        height: '150px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={book.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <BookOpen size={60} color="rgba(255,255,255,0.8)" />
        )}
      </div>

      {/* Book Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '0.5rem',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {book.title}
        </h3>

        <p style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '0.75rem',
          fontWeight: '600'
        }}>
          {book.author}
        </p>

        {book.description && (
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.5'
          }}>
            {book.description}
          </p>
        )}

        {/* Book Details */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {book.genre && (
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '15px',
              fontSize: '0.75rem',
              color: '#fff',
              fontWeight: '600',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
              {book.genre}
            </span>
          )}
          {book.pages && (
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '15px',
              fontSize: '0.75rem',
              color: '#fff',
              fontWeight: '600',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
              {book.pages} págs
            </span>
          )}
        </div>

        {/* Progress Bar (if reading) */}
        {book.status === 'READING' && book.pages && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
              fontSize: '0.75rem',
              color: '#fff',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
              <span>Progreso</span>
              <span>{Math.round((book.currentPage / book.pages) * 100)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(book.currentPage / book.pages) * 100}%`,
                height: '100%',
                backgroundColor: '#fff',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Rating */}
        {book.rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < book.rating ? '#FFD700' : 'none'}
                color={i < book.rating ? '#FFD700' : '#fff'}
              />
            ))}
            <span style={{
              marginLeft: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
              {book.rating}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: 'auto'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(book);
          }}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '600',
            color: '#333',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
        >
          <Edit size={16} />
          Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(book.id);
          }}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: 'rgba(255,0,0,0.8)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '600',
            color: '#fff',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,0,0,1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,0,0,0.8)'}
        >
          <Trash2 size={16} />
          Borrar
        </button>
      </div>
    </div>
  );
};

export default BookCard;