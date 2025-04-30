import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BlogsListPage from './pages/blog/BlogsListPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import BlogFormPage from './pages/blog/BlogFormPage';

// Services
import AuthService from './services/auth.service';

// Theme Provider
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = AuthService.subscribe((authState) => {
      setIsAuthenticated(authState);
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    // No need to setIsAuthenticated here as the AuthService will notify via subscription
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                  <Navigate to="/blogs" /> : 
                  <LoginPage />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? 
                  <Navigate to="/blogs" /> : 
                  <RegisterPage />
                } 
              />
              <Route path="/blogs" element={<BlogsListPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route 
                path="/create-blog" 
                element={
                  <ProtectedRoute>
                    <BlogFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/blogs/edit/:id" 
                element={
                  <ProtectedRoute>
                    <BlogFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="bg-background border-t border-border py-6 px-4">
            <div className="container mx-auto text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} BlogApp. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
