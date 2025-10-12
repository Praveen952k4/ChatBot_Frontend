
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginPage } from '@/components/admin/LoginPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('crackers_craze_logged_in', 'true');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('crackers_craze_logged_in');
    navigate('/login');
  };

  useEffect(() => {
    // Check authentication status from localStorage
    const storedAuth = localStorage.getItem('crackers_craze_logged_in') === 'true';
    setIsLoggedIn(storedAuth);
    
    // Set loading to false after checking authentication
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Handle routing based on authentication status
    if (!storedAuth && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    } else if (storedAuth && location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    } else if (storedAuth && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    } else if (!storedAuth && location.pathname === '/') {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Show loading state to prevent blinking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Always show login page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default Index;
// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
