import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';
import './BlogForm.css';

const BlogForm = ({ blogId = null, editMode = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        published: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        // If in edit mode, fetch the blog data
        if (editMode && blogId) {
            const fetchBlogData = async () => {
                try {
                    setLoading(true);
                    const blog = await blogService.getBlogById(blogId);
                    setFormData({
                        title: blog.title || '',
                        content: blog.content || '',
                        published: blog.published !== undefined ? blog.published : true,
                        // We don't set the image here as we can't fetch the file itself
                    });
                    if (blog.image) {
                        setImagePreview(`http://127.0.0.1:8000/storage/${blog.image}`);
                    }
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load blog data. You may not have permission to edit this post.');
                    setLoading(false);
                }
            };
            
            fetchBlogData();
        }
    }, [blogId, editMode]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            // Handle file input
            setFormData({
                ...formData,
                [name]: files[0]
            });
            
            // Create a preview URL for the selected image
            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(files[0]);
            }
        } else if (type === 'checkbox') {
            // Handle checkbox input
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            // Handle regular inputs
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            if (editMode && blogId) {
                // Update existing blog
                await blogService.updateBlog(blogId, formData);
                setSubmitSuccess(true);
                
                // Redirect to the blog post page after a short delay
                setTimeout(() => {
                    navigate(`/blogs/${blogId}`);
                }, 1500);
            } else {
                // Create new blog
                const response = await blogService.createBlog(formData);
                setSubmitSuccess(true);
                
                // Redirect to the new blog post page after a short delay
                setTimeout(() => {
                    navigate(`/blogs/${response.blog.id}`);
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while saving the blog post');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate(editMode && blogId ? `/blogs/${blogId}` : '/');
        }
    };

    if (loading && !submitSuccess) {
        return <div className="blog-form-loading">Loading...</div>;
    }

    return (
        <div className="blog-form-container">
            <h2 className="blog-form-title">{editMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            
            {error && <div className="blog-form-error">{error}</div>}
            {submitSuccess && <div className="blog-form-success">Blog post saved successfully!</div>}
            
            <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-group">
                    <label htmlFor="title">Blog Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter blog title"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">Blog Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your blog content here..."
                        rows={10}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="image">Featured Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        accept="image/jpeg, image/png, image/gif"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button 
                                type="button" 
                                className="remove-image-button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setFormData({
                                        ...formData,
                                        image: null
                                    });
                                }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleInputChange}
                        />
                        Publish immediately
                    </label>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" disabled={loading || submitSuccess}>
                        {loading ? 'Saving...' : (editMode ? 'Update Blog Post' : 'Create Blog Post')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;