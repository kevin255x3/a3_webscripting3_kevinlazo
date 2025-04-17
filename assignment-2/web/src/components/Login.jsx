// login component - handles user authentication
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    // get login function from auth context
    const { login } = useContext(AuthContext);

    // form state management
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // ui state management
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);

            // validate form data
            if (!formData.email || !formData.password) {
                setError('Email and password are required');
                setLoading(false);
                return;
            }

            // send login request
            const response = await api.post('/api/users/sign-in', formData);

            // extract user data and token from response
            const { token, userId, email } = response.data;

            // store authentication data in context
            login({ userId, email }, token);

            // redirect to home page
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);

            // set appropriate error message
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed. Please try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h1>Log In</h1>

            {/* display error messages */}
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </div>
            </form>

            {/* link to signup page */}
            <p className="auth-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;