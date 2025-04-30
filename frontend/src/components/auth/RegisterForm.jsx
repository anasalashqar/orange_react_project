import React, { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Clear general error when typing
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors from the server
          setErrors(data.errors);
          throw new Error('Please correct the errors in the form');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to login page or dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-form-container">
      <Card className="register-card">
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-0">Create Account</h2>
            <p className="text-muted mt-2">Join our community today</p>
          </div>
          
          {submitError && (
            <Alert variant="danger" className="mb-4">
              {submitError}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                disabled={isLoading}
                className="form-control-lg"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
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
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
              <Form.Text className="text-muted">
                Password must be at least 8 characters long
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="password_confirmation">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  isInvalid={!!errors.password_confirmation}
                  disabled={isLoading}
                  className="form-control-lg"
                />
                <Button 
                  variant="outline-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password_confirmation}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="terms">
              <Form.Check
                type="checkbox"
                label={<>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></>}
                required
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
                  Creating Account...
                </>
              ) : "Create Account"}
            </Button>
            
            <div className="text-center">
              <p className="mb-0">
                Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterForm;