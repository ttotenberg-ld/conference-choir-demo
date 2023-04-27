import React from 'react';
import './App.css';
import Sounds from './components/sounds';
import QR from './components/qrCode'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <QR />
        <Sounds />
      </header>
    </div>
  );
}

export default App;