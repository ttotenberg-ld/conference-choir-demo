import Logo from './components/bottomLogo';
import React from 'react';
import './App.css';
import Title from './components/title';
import Sounds from './components/sounds';
import QR from './components/qrCode';

function App() {
  return (
    <div className="App">
      <body className="App-body">
        <Title />
        <QR />
        <Sounds />
        <Logo />
      </body>
    </div>
  );
}

export default App;