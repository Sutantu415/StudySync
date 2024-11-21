import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/authentication/login';
import RoomPage from './components/roomPage'
import RegisterPage from './components/authentication/register';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<RoomPage />}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
