// protected route component - handles authentication-based routing
// redirects unauthenticated users to login page
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    // get authentication state from context
    const { isAuthenticated, loading } = useContext(AuthContext);

    // show loading indicator while checking auth status
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // redirect to login if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // render the protected content if authenticated
    return children;
};

export default ProtectedRoute;