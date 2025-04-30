import React from 'react';
import BlogForm from '../components/content/BlogForm';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const CreateBlogPage = () => {
    const isAuthenticated = authService.isAuthenticated();
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div className="create-blog-page">
            <BlogForm />
        </div>
    );
};

export default CreateBlogPage;