import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Appointments from './pages/Appointment';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:petId" element={<PetDetails />} />
        <Route path="/pets/:petId/appointments" element={<AppointmentsPet />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
