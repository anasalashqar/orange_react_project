import React, { useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import blogService from '../../services/blogService';

const ContentList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllBlogs();
                setBlogs(data.data || data); // Handle pagination object or direct array
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleLike = async (blogId) => {
        try {
            await blogService.likeBlog(blogId);
            // Refresh blogs after like
            const data = await blogService.getAllBlogs();
            setBlogs(data.data || data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleComment = async (blogId, commentContent) => {
        try {
            await blogService.addComment(blogId, commentContent);
            // Refresh blogs after comment
            const data = await blogService.getAllBlogs();
            setBlogs(data.data || data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading blogs...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="content-list">
            {blogs.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                blogs.map(blog => (
                    <ContentCard 
                        key={blog.id} 
                        content={blog} 
                        onLike={handleLike} 
                        onComment={handleComment} 
                    />
                ))
            )}
        </div>
    );
};

export default ContentList;