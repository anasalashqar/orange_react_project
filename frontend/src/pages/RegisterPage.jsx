import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Container } from 'react-bootstrap';

const RegisterPage = () => {
    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">Register</h1>
            <RegisterForm />
        </Container>
    );
};

export default RegisterPage;