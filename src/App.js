import Logo from './components/bottomLogo';
import React from 'react';
import './App.css';
import Title from './components/title';
import Sounds from './components/sounds';
import QR from './components/qrCode';
import SoundTest from './components/soundTest';

function App() {
  return (
    <div className="App">
      <body className="App-body">
        <Title />
        <SoundTest />
        <QR />
        <Sounds />
        <Logo />
      </body>
    </div>
  );
}

export default App;