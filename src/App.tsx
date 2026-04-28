import { Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import AllProductsPage from './components/AllProductsPage';
import About from './components/About';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<AllProductsPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
