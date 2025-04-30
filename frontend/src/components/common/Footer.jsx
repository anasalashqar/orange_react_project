import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-light py-5 mt-auto">
            <Container>
                <Row className="mb-4">
                    <Col lg={4} className="mb-4 mb-lg-0">
                        <h5 className="mb-3">
                            <span className="orange-text fw-bold">Orange</span>
                            <span className="dark-text fw-bold">App</span>
                        </h5>
                        <p className="text-muted mb-4">
                            Building innovative solutions for a connected world. Your trusted partner in digital transformation.
                        </p>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-4 mb-sm-0">
                        <h6 className="text-uppercase mb-3 fw-bold">Company</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-4 mb-sm-0">
                        <h6 className="text-uppercase mb-3 fw-bold">Support</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </Col>
                    <Col lg={4} md={4}>
                        <h6 className="text-uppercase mb-3 fw-bold">Stay Updated</h6>
                        <p className="text-muted mb-3">Subscribe to our newsletter for the latest updates</p>
                        <form className="newsletter-form">
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Your email address" 
                                    aria-label="Your email address"
                                />
                                <button className="btn btn-primary" type="submit">Subscribe</button>
                            </div>
                        </form>
                    </Col>
                </Row>
                <hr className="my-4" />
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start">
                        <p className="mb-0 text-muted small">© {new Date().getFullYear()} OrangeApp. All rights reserved.</p>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <p className="mb-0 text-muted small">
                            <Link to="/terms" className="text-reset me-3">Terms</Link>
                            <Link to="/privacy" className="text-reset me-3">Privacy</Link>
                            <Link to="/cookies" className="text-reset">Cookies</Link>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;