import React from 'react';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Clientas from './Clientas';
import Canjes from './Canjes';
import Premios from './Premios';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientas" element={<Clientas />} />
          <Route path="/canjes" element={<Canjes />} />
          <Route path="/premios" element={<Premios />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
