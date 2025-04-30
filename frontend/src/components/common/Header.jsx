import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Check if user is logged in by looking at localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const closeNavbar = () => setExpanded(false);
    
    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Update state
        setUser(null);
        closeNavbar();
        
        // Navigate to homepage
        navigate('/');
    };

    return (
        <Navbar 
            bg="light" 
            expand="lg" 
            fixed="top" 
            className="shadow-sm py-2 navbar-modern"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    <span className="orange-text fw-bold">Orange</span>
                    <span className="dark-text fw-bold">App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto nav-links">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            onClick={closeNavbar}
                            className={location.pathname === '/' ? 'active' : ''}
                        >
                            <i className="bi bi-house-door me-1"></i> Home
                        </Nav.Link>
                        
                        {/* Blog dropdown menu */}
                        <NavDropdown 
                            title={<span><i className="bi bi-journal-richtext me-1"></i> Blogs</span>} 
                            id="blog-dropdown"
                            className={location.pathname.startsWith('/blog') ? 'active' : ''}
                        >
                            <NavDropdown.Item as={Link} to="/content" onClick={closeNavbar}>
                                <i className="bi bi-grid me-1"></i> All Blogs
                            </NavDropdown.Item>
                            
                            {user && (
                                <>
                                    <NavDropdown.Item as={Link} to="/create-blog" onClick={closeNavbar}>
                                        <i className="bi bi-plus-circle me-1"></i> Create New Blog
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                                        <i className="bi bi-person-lines-fill me-1"></i> My Blogs
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                        
                        {!user ? (
                            // Show these links only when user is NOT logged in
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/login" 
                                    onClick={closeNavbar}
                                    className={location.pathname === '/login' ? 'active' : ''}
                                >
                                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/register" 
                                    onClick={closeNavbar}
                                    className={`${location.pathname === '/register' ? 'active' : ''} d-lg-none`}
                                >
                                    <i className="bi bi-person-plus me-1"></i> Register
                                </Nav.Link>
                            </>
                        ) : null}
                        
                        {/* Always visible links */}
                        <Nav.Link 
                            as={Link} 
                            to="/content" 
                            onClick={closeNavbar}
                            className={location.pathname === '/content' ? 'active' : ''}
                        >
                            <i className="bi bi-grid me-1"></i> Content
                        </Nav.Link>
                        
                        {/* Show profile link when logged in */}
                        {user && (
                            <Nav.Link 
                                as={Link} 
                                to="/profile" 
                                onClick={closeNavbar}
                                className={location.pathname === '/profile' ? 'active' : ''}
                            >
                                <i className="bi bi-person me-1"></i> Profile
                            </Nav.Link>
                        )}
                    </Nav>
                    
                    <div className="ms-lg-3 mt-3 mt-lg-0">
                        {!user ? (
                            // When user is NOT logged in, show Sign Up button
                            <Button 
                                as={Link} 
                                to="/register" 
                                variant="primary" 
                                className="signup-btn d-none d-lg-inline-block"
                            >
                                Sign Up
                            </Button>
                        ) : (
                            // When user is logged in, show user dropdown with logout
                            <NavDropdown 
                                title={
                                    <span>
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user.name}
                                    </span>
                                } 
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                                    <i className="bi bi-person-badge me-2"></i> My Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/create-blog" onClick={closeNavbar}>
                                    <i className="bi bi-journal-plus me-2"></i> New Blog Post
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;