import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogForm from '../components/content/BlogForm';
import authService from '../services/authService';

const EditBlogPage = () => {
    const { id } = useParams();
    const isAuthenticated = authService.isAuthenticated();
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div className="edit-blog-page">
            <BlogForm blogId={id} editMode={true} />
        </div>
    );
};

export default EditBlogPage;