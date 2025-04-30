import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import authService from '../services/authService';
import CommentSection from '../components/content/CommentSection';
import './BlogPostPage.css';

const BlogPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogById(id);
                setBlog(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load blog post. It may have been deleted or you don\'t have permission to view it.');
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        try {
            await blogService.likeBlog(id);
            // Refresh blog data after like
            const data = await blogService.getBlogById(id);
            setBlog(data);
        } catch (err) {
            setError('Failed to like blog post. You might need to log in first.');
        }
    };

    const handleComment = async (blogId, commentContent) => {
        try {
            await blogService.addComment(blogId, commentContent);
            // Refresh blog data after adding comment
            const data = await blogService.getBlogById(id);
            setBlog(data);
        } catch (err) {
            setError('Failed to add comment. You might need to log in first.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            try {
                await blogService.deleteBlog(id);
                navigate('/'); // Redirect to homepage after deletion
            } catch (err) {
                setError('Failed to delete blog post. You might not have permission.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-blog/${id}`);
    };

    if (loading) return <div className="blog-loading">Loading blog post...</div>;
    if (error) return <div className="blog-error">{error}</div>;
    if (!blog) return <div className="blog-not-found">Blog post not found</div>;

    const isAuthor = currentUser && blog.user && currentUser.id === blog.user.id;
    
    return (
        <div className="blog-post-page">
            <div className="blog-post-container">
                {blog.image && (
                    <div className="blog-image">
                        <img 
                            src={`http://127.0.0.1:8000/storage/${blog.image}`} 
                            alt={blog.title} 
                        />
                    </div>
                )}
                
                <div className="blog-header">
                    <h1 className="blog-title">{blog.title}</h1>
                    
                    <div className="blog-meta">
                        {blog.user && (
                            <p className="blog-author">By: {blog.user.name}</p>
                        )}
                        {blog.created_at && (
                            <p className="blog-date">
                                {new Date(blog.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                    
                    {isAuthor && (
                        <div className="blog-actions">
                            <button onClick={handleEdit} className="edit-button">Edit</button>
                            <button onClick={handleDelete} className="delete-button">Delete</button>
                        </div>
                    )}
                </div>
                
                <div className="blog-content">
                    {blog.content}
                </div>
                
                <div className="blog-interactions">
                    <button onClick={handleLike} className="like-button">
                        {blog.likes?.length || 0} Likes
                    </button>
                </div>
                
                <CommentSection 
                    comments={blog.comments || []} 
                    blogId={blog.id}
                    onAddComment={handleComment}
                />
            </div>
        </div>
    );
};

export default BlogPostPage;