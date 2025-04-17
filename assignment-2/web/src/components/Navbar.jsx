// navbar component - handles navigation and authentication UI
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    // get authentication state from context
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // handle logout action
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* site brand/logo with link to homepage */}
            <div className="navbar-brand">
                <Link to="/">dog ear books</Link>
            </div>

            <div className="navbar-menu">
                {/* conditional rendering based on auth status */}
                {isAuthenticated ? (
                    <>
                        {/* show user email when logged in */}
                        <span className="navbar-user">
                            {user.email}
                        </span>
                        {/* logout button */}
                        <button onClick={handleLogout} className="btn btn-logout">
                            Logout
                        </button>
                    </>
                ) : (
                    /* show login/signup links when logged out */
                    <div className="navbar-auth">
                        <Link to="/login" className="btn btn-login">Login</Link>
                        <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;