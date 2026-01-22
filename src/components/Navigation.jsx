import React from 'react';
import { Book, BookOpen, BarChart3, Home } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const colors = {
    home: '#FD3DB5',
    library: '#8FD9FB',
    reading: '#FFEE8C',
    stats: '#0066FF'
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: colors.home },
    { id: 'library', label: 'Mi Biblioteca', icon: Book, color: colors.library },
    { id: 'reading', label: 'Leyendo', icon: BookOpen, color: colors.reading },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3, color: colors.stats }
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: '#f5f5f5',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            fontFamily: 'Helvetica, Arial, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {['B', 'O', 'O ', 'K', 'S', 'H', 'E', 'L', 'F'].map((letter, idx) => (
            <span 
              key={idx} 
              style={{ 
                color: Object.values(colors)[idx % Object.values(colors).length],
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Menu Items */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isActive ? item.color : 'transparent',
                  color: isActive ? '#fff' : '#333',
                  border: isActive ? 'none' : `2px solid ${item.color}`,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: isActive ? 'bold' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = item.color;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;