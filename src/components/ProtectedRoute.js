import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Slab } from 'react-loading-indicators';

function ProtectedRoute({ children }) {
  let isLoaded = true;
  let isSignedIn = true;
  
  try {
    const auth = useAuth();
    isLoaded = auth.isLoaded;
    isSignedIn = auth.isSignedIn;
  } catch (error) {
    console.warn('Clerk not available, allowing access:', error);
    isLoaded = true;
    isSignedIn = true;
  }

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Slab color="#3eba3e" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (showLoader) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Slab color="#3eba3e" size="medium" text="" textColor="" />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;


