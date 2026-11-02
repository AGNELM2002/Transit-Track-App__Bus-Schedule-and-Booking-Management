import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import BusForm from './components/BusForm';
import BusTable from './components/BusTable';
import BusDetail from './components/BusDetail';
import Booking from './components/Booking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<BusForm />} />
          <Route path="/buses" element={<BusTable />} />
          <Route path="/bus-detail" element={<BusDetail />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;