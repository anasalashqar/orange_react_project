import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';

const HomePage = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getAllBlogs();
        // Get first 3 blogs as featured blogs
        const blogs = response.data || response;
        setFeaturedBlogs(blogs.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-5">
        <Col lg={6}>
          <h1 className="display-4 fw-bold mb-3">Welcome to <span className="text-primary">Orange</span>App</h1>
          <p className="lead mb-4">
            Discover our platform designed to make your digital experience seamless and productive.
          </p>
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg" href="/register">
              Get Started
            </Button>
            <Button variant="outline-secondary" size="lg" href="/content">
              Explore Content
            </Button>
          </div>
        </Col>
        <Col lg={6} className="mt-5 mt-lg-0 text-center">
          <img 
            src="https://via.placeholder.com/600x400" 
            alt="Hero Image" 
            className="img-fluid rounded shadow-lg" 
            style={{ maxHeight: '400px' }}
          />
        </Col>
      </Row>
      
      <h2 className="text-center my-5">Our Features</h2>
      
      <Row className="g-4 mb-5">
        {[
          { 
            title: 'Easy to Use', 
            description: 'Our intuitive interface makes navigation simple and efficient',
            icon: 'bi-hand-thumbs-up' 
          },
          { 
            title: 'Secure', 
            description: 'Your data is protected with industry-leading security practices',
            icon: 'bi-shield-check' 
          },
          { 
            title: 'Fast Performance', 
            description: 'Optimized for speed to enhance your productivity',
            icon: 'bi-lightning-charge' 
          },
          { 
            title: 'Responsive', 
            description: 'Access from any device with our fully responsive design',
            icon: 'bi-phone' 
          }
        ].map((feature, index) => (
          <Col md={6} lg={3} key={index}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="feature-icon bg-primary bg-gradient text-white mb-3">
                  <i className={`bi ${feature.icon} fs-1`}></i>
                </div>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text className="text-muted">
                  {feature.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Featured Blog Posts Section */}
      <section className="featured-blogs py-5">
        <h2 className="text-center mb-4">Featured Blog Posts</h2>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading featured blogs...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : featuredBlogs.length > 0 ? (
          <Row className="g-4">
            {featuredBlogs.map(blog => (
              <Col md={4} key={blog.id}>
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
                    <Card.Title as="h5">{blog.title}</Card.Title>
                    <Card.Text>
                      {blog.content.length > 120 
                        ? blog.content.substring(0, 120) + '...' 
                        : blog.content}
                    </Card.Text>
                    {blog.user && (
                      <div className="blog-author mb-2 small text-muted">
                        By: {blog.user.name}
                      </div>
                    )}
                    <Link to={`/blogs/${blog.id}`} className="btn btn-outline-primary btn-sm">
                      Read More
                    </Link>
                  </Card.Body>
                  <Card.Footer className="text-muted small">
                    {blog.created_at && new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-4">
            <p>No blog posts found.</p>
            <Link to="/create-blog" className="btn btn-primary">Create your first blog post</Link>
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link to="/content" className="btn btn-outline-primary">
            View All Blog Posts
          </Link>
        </div>
      </section>
    </Container>
  );
};

export default HomePage;