import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dinosaurs from './screens/Dinosaurs';
import Home from './screens/Home';
import About from './screens/About';
import Editor from './screens/Editor';
import Dashboard from './screens/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

export const UserContext = createContext();

const App: React.FC = () => {
  const [user, setUser] = useState({ name: '', age: 0 });

  return (
    <UserContext value={{ user, setUser }}>
    <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dinosaurs" element={<Dinosaurs />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
    </Router>
  </UserContext>
  );
};

export default App;