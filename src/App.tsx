import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import VehicleEntry from "./pages/VehicleEntry";
import ServiceHistory from "./pages/ServiceHistory";
import ServicesManagement from "./pages/ServicesManagement";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
              path="/*"
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;