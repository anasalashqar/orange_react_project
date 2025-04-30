import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserInfo from '../components/profile/UserInfo';
import ContentCard from '../components/content/ContentCard';
import blogService from '../services/blogService';
import authService from '../services/authService';
import './ProfilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            setError(null);

            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You need to be logged in to view your profile');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Token expired or invalid
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login');
                        throw new Error('Session expired. Please log in again.');
                    }
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.error('Profile fetch error:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Fetch user's blogs
    useEffect(() => {
        const fetchUserBlogs = async () => {
            if (!authService.isAuthenticated()) return;
            
            try {
                setBlogsLoading(true);
                const blogs = await blogService.getUserBlogs();
                setUserBlogs(blogs.data || blogs);
                setBlogsLoading(false);
            } catch (err) {
                console.error('Error fetching user blogs:', err);
                setBlogsLoading(false);
            }
        };
        
        fetchUserBlogs();
    }, []);

    const handleLike = async (blogId) => {
        try {
            await blogService.likeBlog(blogId);
            // Refresh blogs after like
            const blogs = await blogService.getUserBlogs();
            setUserBlogs(blogs.data || blogs);
        } catch (err) {
            console.error('Error liking blog:', err);
        }
    };

    const handleComment = async (blogId, commentContent) => {
        try {
            await blogService.addComment(blogId, commentContent);
            // Refresh blogs after comment
            const blogs = await blogService.getUserBlogs();
            setUserBlogs(blogs.data || blogs);
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            try {
                await blogService.deleteBlog(blogId);
                // Refresh blogs after deletion
                const blogs = await blogService.getUserBlogs();
                setUserBlogs(blogs.data || blogs);
            } catch (err) {
                console.error('Error deleting blog:', err);
            }
        }
    };

    // If still loading, show spinner
    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading your profile...</p>
            </Container>
        );
    }

    // If error occurred
    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    {error.includes('logged in') && (
                        <div className="d-flex justify-content-end">
                            <Alert.Link href="/login">Go to Login</Alert.Link>
                        </div>
                    )}
                </Alert>
            </Container>
        );
    }

    // If no user data
    if (!userData) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    <Alert.Heading>Profile Not Found</Alert.Heading>
                    <p>We couldn't find your profile information.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row>
                <Col md={4}>
                    <div className="profile-sidebar">
                        <h1 className="mb-4">My Profile</h1>
                        <UserInfo user={userData} />
                    </div>
                </Col>
                <Col md={8}>
                    <div className="user-blogs-section">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>My Blog Posts</h2>
                            <Link to="/create-blog">
                                <Button variant="primary">Create New Blog</Button>
                            </Link>
                        </div>
                        
                        {blogsLoading ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" size="sm" role="status" />
                                <span className="ms-2">Loading your blogs...</span>
                            </div>
                        ) : userBlogs.length > 0 ? (
                            <div className="user-blogs-list">
                                {userBlogs.map(blog => (
                                    <div key={blog.id} className="user-blog-item">
                                        <ContentCard 
                                            content={blog} 
                                            onLike={handleLike}
                                            onComment={handleComment}
                                        />
                                        <div className="blog-actions">
                                            <Link to={`/edit-blog/${blog.id}`} className="btn btn-sm btn-outline-primary">
                                                Edit
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(blog.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Alert variant="info">
                                You haven't created any blog posts yet. Click the "Create New Blog" button to get started.
                            </Alert>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;