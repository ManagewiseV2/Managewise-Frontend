import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects'; // NUEVA
import Profile from './pages/Profile';   // NUEVA
import Home from './pages/Home';
import Backlog from './pages/Backlog';
import Members from './pages/Members';
import Meeting from './pages/Meeting';
import Activity from './pages/Activity'; // NUEVA
import Reports from './pages/Reports';   // NUEVA
import ManageWiseAI from './pages/ManageWiseAI'; // NUEVA

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        
        
        {/* Gateway / Hub */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} />

        {/* Vistas internas de un proyecto específico */}
        <Route path="/home" element={<Home />} />
        <Route path="/backlog" element={<Backlog />} />
        <Route path="/members" element={<Members />} />
        <Route path="/meeting" element={<Meeting />} />

        {/* Vistas PRO */}
        <Route path="/activity" element={<Activity />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ManageWiseAI" element={<ManageWiseAI />} />

       
      </Routes>
    </BrowserRouter>
  );
}