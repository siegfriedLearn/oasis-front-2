import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import VehicleEntry from './pages/VehicleEntry';
import ServiceHistory from './pages/ServiceHistory';
import ServicesManagement from './pages/ServicesManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Routes>
                  <Route path="/" element={<Navigate to="/vehicle-entry" />} />
                  <Route path="/vehicle-entry" element={<VehicleEntry />} />
                  <Route path="/service-history" element={<ServiceHistory />} />
                  <Route path="/services-management" element={<ServicesManagement />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;