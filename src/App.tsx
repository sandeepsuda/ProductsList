import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AllProductsPage from './components/AllProductsPage';
import About from './components/About';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<AllProductsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
