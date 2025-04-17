// signup component - handles new user registration
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    const navigate = useNavigate();

    // form state management
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    // ui state management
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // client-side form validation
    const validateForm = () => {
        // email validation with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // password length validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        // password match validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // validate form before submitting
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // send signup request
            await api.post('/api/users', {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            // show success message
            setSuccess(true);

            // redirect to login page after short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Signup error:', err);

            // set appropriate error message
            if (err.response && err.response.data) {
                if (err.response.data.errors && err.response.data.errors.length > 0) {
                    setError(err.response.data.errors[0].msg);
                } else {
                    setError(err.response.data.message || 'Signup failed. Please try again.');
                }
            } else {
                setError('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h1>Create Account</h1>

            {/* display error or success messages */}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">Account created successfully! Redirecting to login...</div>}

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
                        disabled={loading || success}
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
                        placeholder="Create a password (min. 6 characters)"
                        disabled={loading || success}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        disabled={loading || success}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading || success}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </div>
            </form>

            {/* link to login page */}
            <p className="auth-link">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Signup;