import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, BookOpen, Award, Target } from 'lucide-react';
import { bookService } from '../services/api';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: '#FD3DB5',
    secondary: '#8FD9FB',
    accent: '#FFEE8C',
    info: '#0066FF',
    wishlist: '#FFB6C1',
    reading: '#87CEEB',
    completed: '#90EE90',
    dnf: '#FFB347'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, booksRes] = await Promise.all([
        bookService.getStats(),
        bookService.getAllBooks()
      ]);
      setStats(statsRes.data);
      setAllBooks(booksRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Error al cargar las estadísticas');
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
          color: colors.info
        }}>
          Cargando estadísticas...
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const statusData = [
    { name: 'Quiero Leer', value: stats.wishlistBooks, color: colors.wishlist },
    { name: 'Leyendo', value: stats.readingBooks, color: colors.reading },
    { name: 'Completados', value: stats.completedBooks, color: colors.completed },
    { name: 'Abandonados', value: stats.dnfBooks, color: colors.dnf }
  ];

  // Agrupar por género
  const genreData = allBooks.reduce((acc, book) => {
    const genre = book.genre || 'Sin género';
    const existing = acc.find(item => item.name === genre);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: genre, value: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <div style={{
      paddingTop: '6rem',
      minHeight: '100vh',
      padding: '6rem 2rem 2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <TrendingUp size={48} color={colors.info} />
            <h1 style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: colors.info,
              margin: 0
            }}>
              Mis Estadísticas
            </h1>
          </div>
          <p style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '1.25rem',
            color: '#666'
          }}>
            Tu progreso literario en números
          </p>
        </div>

        {/* Main Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <StatCard
            icon={<BookOpen size={40} />}
            label="Total de Libros"
            value={stats.totalBooks}
            color={colors.primary}
          />
          <StatCard
            icon={<Award size={40} />}
            label="Completados"
            value={stats.completedBooks}
            color={colors.completed}
          />
          <StatCard
            icon={<BookOpen size={40} />}
            label="Leyendo"
            value={stats.readingBooks}
            color={colors.reading}
          />
          <StatCard
            icon={<Target size={40} />}
            label="Páginas Leídas"
            value={stats.totalPagesRead}
            color={colors.info}
          />
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Status Distribution */}
          <ChartCard title="Distribución por Estado" color={colors.primary}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Genres */}
          <ChartCard title="Géneros Favoritos" color={colors.secondary}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={colors.secondary} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Additional Stats */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '2rem',
          padding: '2rem'
        }}>
          <h2 style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Otros Datos Interesantes
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <MiniStatCard
              label="Promedio de Páginas"
              value={Math.round(
                allBooks.filter(b => b.pages).reduce((sum, b) => sum + b.pages, 0) / 
                (allBooks.filter(b => b.pages).length || 1)
              )}
              unit="págs"
              color={colors.accent}
            />
            <MiniStatCard
              label="Libro más largo"
              value={Math.max(...allBooks.map(b => b.pages || 0))}
              unit="págs"
              color={colors.info}
            />
            <MiniStatCard
              label="Libros con rating"
              value={allBooks.filter(b => b.rating).length}
              unit={`de ${stats.totalBooks}`}
              color={colors.primary}
            />
            <MiniStatCard
              label="Rating promedio"
              value={(
                allBooks.filter(b => b.rating).reduce((sum, b) => sum + b.rating, 0) /
                (allBooks.filter(b => b.rating).length || 1)
              ).toFixed(1)}
              unit="⭐"
              color={colors.completed}
            />
          </div>
        </div>

        {/* Progress Message */}
        {stats.totalBooks > 0 && (
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: colors.primary,
            borderRadius: '1.5rem',
            color: '#fff'
          }}>
            <h3 style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              ¡Sigue así! 🎉
            </h3>
            <p style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '1.125rem',
              opacity: 0.9
            }}>
              Has completado el {Math.round((stats.completedBooks / stats.totalBooks) * 100)}% de tu biblioteca
            </p>
          </div>
        )}
      </div>
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

const ChartCard = ({ title, color, children }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: `3px solid ${color}`
  }}>
    <h3 style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: color,
      marginBottom: '1.5rem',
      textAlign: 'center'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

const MiniStatCard = ({ label, value, unit, color }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center',
    border: `2px solid ${color}`,
    transition: 'all 0.3s'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = color;
    e.currentTarget.style.color = '#fff';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#fff';
    e.currentTarget.style.color = '#333';
  }}
  >
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    }}>
      {value}
    </div>
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '600'
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '0.75rem',
      opacity: 0.7,
      marginTop: '0.25rem'
    }}>
      {unit}
    </div>
  </div>
);

export default Stats;