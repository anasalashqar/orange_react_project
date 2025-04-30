import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Container } from 'react-bootstrap';

const LoginPage = () => {
    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">Login</h1>
            <LoginForm />
        </Container>
    );
};

export default LoginPage;