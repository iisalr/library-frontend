import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, TrendingUp, Heart } from 'lucide-react';
import { bookService } from '../services/api';

const Home = ({ setCurrentPage }) => {
  const [stats, setStats] = useState(null);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: '#FD3DB5',
    secondary: '#8FD9FB',
    accent: '#FFEE8C',
    info: '#0066FF'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, readingRes] = await Promise.all([
        bookService.getStats(),
        bookService.getCurrentlyReading()
      ]);
      setStats(statsRes.data);
      setCurrentlyReading(readingRes.data.slice(0, 3)); // Solo los primeros 3
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
          color: colors.primary
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
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '3rem 1rem'
        }}>
          <h1 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            {['H', 'o', 'l', 'a', ',', ' ', 'I', 's', 'a', 'b', 'e', 'l', 'l', 'a', '!'].map((letter, idx) => (
              <span 
                key={idx} 
                style={{ 
                  color: Object.values(colors)[idx % Object.values(colors).length],
                  display: letter === ' ' ? 'inline' : 'inline-block',
                  animation: `bounce 0.5s ease ${idx * 0.05}s`
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1.5rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            Tu espacio personal para documentar y disfrutar cada lectura
          </p>
          <button
            onClick={() => setCurrentPage('library')}
            style={{
              padding: '1.25rem 2.5rem',
              backgroundColor: colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Helvetica, Arial, sans-serif',
              boxShadow: '0 4px 20px rgba(253, 61, 181, 0.4)',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Explorar Mi Biblioteca
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          <StatCard
            icon={<BookOpen size={40} />}
            label="Total de Libros"
            value={stats?.totalBooks || 0}
            color={colors.primary}
          />
          <StatCard
            icon={<Heart size={40} />}
            label="Completados"
            value={stats?.completedBooks || 0}
            color={colors.secondary}
          />
          <StatCard
            icon={<TrendingUp size={40} />}
            label="Leyendo Ahora"
            value={stats?.readingBooks || 0}
            color={colors.accent}
          />
          <StatCard
            icon={<BookOpen size={40} />}
            label="Páginas Leídas"
            value={stats?.totalPagesRead || 0}
            color={colors.info}
          />
        </div>

        {/* Currently Reading Section */}
        {currentlyReading.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: colors.secondary
              }}>
                Actualmente Leyendo
              </h2>
              <button
                onClick={() => setCurrentPage('reading')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: colors.secondary,
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.secondary;
                }}
              >
                Ver Todos
                <ArrowRight size={18} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {currentlyReading.map(book => (
                <ReadingBookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '2rem',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '1.5rem'
          }}>
            ¿Qué te gustaría hacer hoy?
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <ActionButton
              label="Ver Estadísticas"
              color={colors.info}
              onClick={() => setCurrentPage('stats')}
            />
            <ActionButton
              label="Mi Biblioteca"
              color={colors.primary}
              onClick={() => setCurrentPage('library')}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    border: `3px solid ${color}`,
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  }}
  >
    <div style={{
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      opacity: 0.1,
      color: color
    }}>
      {icon}
    </div>
    <div style={{ color: color, marginBottom: '1rem' }}>
      {icon}
    </div>
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '3rem',
      fontWeight: 'bold',
      color: color,
      marginBottom: '0.5rem'
    }}>
      {value}
    </div>
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '1rem',
      color: '#666',
      fontWeight: '600'
    }}>
      {label}
    </div>
  </div>
);

const ReadingBookCard = ({ book }) => (
  <div style={{
    backgroundColor: '#87CEEB',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <h3 style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '0.5rem'
    }}>
      {book.title}
    </h3>
    <p style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '1rem'
    }}>
      {book.author}
    </p>
    {book.pages && (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          color: '#fff',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}>
          <span>{book.currentPage} / {book.pages} páginas</span>
          <span>{Math.round((book.currentPage / book.pages) * 100)}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(book.currentPage / book.pages) * 100}%`,
            height: '100%',
            backgroundColor: '#fff',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>
    )}
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '1rem 2rem',
      backgroundColor: color,
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontFamily: 'Helvetica, Arial, sans-serif',
      transition: 'all 0.3s',
      boxShadow: `0 4px 15px ${color}40`
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    {label}
  </button>
);

export default Home;