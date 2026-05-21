import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppShell from './components/AppShell';
import AllProductsPage from './components/AllProductsPage';
import About from './components/About';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuthStatus } from './store/authSlice';
import type { AppDispatch, RootState } from './store';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [emergencyShow, setEmergencyShow] = useState(false);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setEmergencyShow(false);
      return undefined;
    }

    // Emergency timeout: if still loading after 3s, show anyway
    const timer = setTimeout(() => {
      setEmergencyShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  const shouldShowLoading = loading && !emergencyShow;

  if (shouldShowLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Checking your session...</h2>
          <p>Please wait a moment.</p>
          <button onClick={() => setEmergencyShow(true)} style={{ marginTop: '10px' }}>
            Click here if it takes too long
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AllProductsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  );
}

export default App;
