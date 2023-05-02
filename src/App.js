import React from 'react';
import './App.css';
import Sounds from './components/sounds';
import QR from './components/qrCode';
import SoundTest from './components/soundTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SoundTest />
        <QR />
        <Sounds />
      </header>
    </div>
  );
}

export default App;