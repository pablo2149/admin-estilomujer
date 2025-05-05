import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Clientas from "./pages/Clientas";
import Premios from "./pages/Premios";
import CrearPremio from "./pages/CrearPremio";
import Historial from "./pages/Historial";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientas" element={<Clientas />} />
        <Route path="/premios" element={<Premios />} />
        <Route path="/crear-premio" element={<CrearPremio />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </Router>
  );
}

export default App;
