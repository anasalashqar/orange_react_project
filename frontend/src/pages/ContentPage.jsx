import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import authService from '../services/authService';
import './ContentPage.css';

const ContentPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await blogService.getAllBlogs();
                setBlogs(response.data || response);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blog posts. Please try again later.');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Filter blogs based on search term
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-4">
            <div className="content-page-header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h1 className="mb-3 mb-md-0">Blog Posts</h1>
                <div className="d-flex flex-column flex-md-row gap-3">
                    <InputGroup>
                        <Form.Control
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => setSearchTerm('')}
                            >
                                Clear
                            </Button>
                        )}
                    </InputGroup>
                    
                    {isAuthenticated && (
                        <Button 
                            as={Link}
                            to="/create-blog" 
                            variant="primary"
                        >
                            Create New Blog
                        </Button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading blogs...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : filteredBlogs.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {filteredBlogs.map(blog => (
                        <Col key={blog.id}>
                            <Card className="blog-card h-100 shadow-sm">
                                {blog.image && (
                                    <div className="card-img-top-wrapper">
                                        <Card.Img 
                                            variant="top" 
                                            src={`http://127.0.0.1:8000/storage/${blog.image}`} 
                                            alt={blog.title}
                                        />
                                    </div>
                                )}
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>
                                        {blog.content.length > 150 
                                            ? blog.content.substring(0, 150) + '...' 
                                            : blog.content}
                                    </Card.Text>
                                    
                                    <div className="blog-meta">
                                        {blog.user && (
                                            <div className="blog-author">
                                                By: {blog.user.name}
                                            </div>
                                        )}
                                        
                                        <div className="blog-stats">
                                            <span className="me-2">
                                                <i className="bi bi-heart"></i> {blog.likes?.length || 0}
                                            </span>
                                            <span>
                                                <i className="bi bi-chat"></i> {blog.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <Link to={`/blogs/${blog.id}`} className="btn btn-outline-primary w-100 mt-3">
                                        Read More
                                    </Link>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    {blog.created_at && new Date(blog.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <h3>No blog posts found</h3>
                    {searchTerm && (
                        <p>No results match your search: "{searchTerm}"</p>
                    )}
                    {isAuthenticated && (
                        <Link to="/create-blog" className="btn btn-primary mt-3">
                            Create Your First Blog Post
                        </Link>
                    )}
                </div>
            )}
        </Container>
    );
};

export default ContentPage;