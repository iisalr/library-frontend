import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import MyLibrary from './pages/MyLibrary';
import CurrentlyReading from './pages/CurrentlyReading';
import Stats from './pages/Stats';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'library':
        return <MyLibrary />;
      case 'reading':
        return <CurrentlyReading />;
      case 'stats':
        return <Stats />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', minHeight: '100vh' }}>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;