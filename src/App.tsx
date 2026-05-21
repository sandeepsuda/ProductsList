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

function AppRoutes() {
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

function AuthLoadingGate() {
  const [emergencyShow, setEmergencyShow] = useState(false);

  useEffect(() => {
    // Emergency timeout: if still loading after 3s, show the app anyway.
    const timer = setTimeout(() => {
      setEmergencyShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (emergencyShow) {
    return <AppRoutes />;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return <AuthLoadingGate />;
  }

  return <AppRoutes />;
}

export default App;
