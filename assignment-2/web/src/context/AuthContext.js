// auth context - provides authentication state to the entire application
// implements react context api for global state management
import React, { createContext, useState, useEffect } from 'react';

// create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // initialize auth state from localStorage on app load
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    // login function - stores auth data and updates state
    const login = (userData, authToken) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
    };

    // logout function - clears auth data and resets state
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    // provide auth context to all child components
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            token,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};