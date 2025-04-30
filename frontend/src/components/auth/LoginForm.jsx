import React, { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear field-specific error when typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        
        // Clear API error on any input change
        if (apiError) setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setApiError('');
        
        try {
            console.log('Attempting login with:', formData.email);
            
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
                // Don't include credentials - causes CORS issues
                credentials: 'omit'
            });
            
            console.log('Login response status:', response.status);
            
            const data = await response.json();
            console.log('Login response data:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }
            
            // Store token and user data in localStorage based on the exact response format
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('Login successful:', data);
            
            // Redirect to dashboard or home page
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            setApiError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-form-container">
            <Card className="login-card">
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-0">Welcome Back</h2>
                        <p className="text-muted mt-2">Sign in to your account</p>
                    </div>
                    
                    {apiError && (
                        <Alert variant="danger" className="mb-4">
                            {apiError}
                        </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                disabled={isLoading}
                                className="form-control-lg"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="password">
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Label>Password</Form.Label>
                                <Link to="/forgot-password" className="text-decoration-none small">
                                    Forgot password?
                                </Link>
                            </div>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    disabled={isLoading}
                                    className="form-control-lg"
                                />
                                <Button 
                                    variant="outline-secondary"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="rememberMe">
                            <Form.Check
                                type="checkbox"
                                label="Remember me"
                            />
                        </Form.Group>
                        
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 btn-lg mb-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Signing in...
                                </>
                            ) : "Sign In"}
                        </Button>
                        
                        <div className="text-center">
                            <p className="mb-0">
                                Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link>
                            </p>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginForm;