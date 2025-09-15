// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './components/ui/home';
import About from './components/ui/about';
import Contact from './components/ui/contact';
import Layout from './pages/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import EmployesPage from './pages/EmployesPage';
import PresencesPage from './pages/PresencesPage';
import RapportsPage from './pages/RapportsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login-form" element={<LoginPage />} />

        {/* Route imbriquée : /dashboard/* utilise le layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardPage />} /> 
          <Route path="employes" element={<EmployesPage />} />
          <Route path="presences" element={<PresencesPage />} />
          <Route path="presences/ma-presence" element={<PresencesPage />} />
          <Route path="presences/ma-presence/arrivee" element={<PresencesPage />} />
          <Route path="presences/ma-presence/sortie" element={<PresencesPage />} />
          <Route path="rapports" element={<RapportsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;