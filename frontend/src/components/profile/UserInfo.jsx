import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import './UserInfo.css';

const UserInfo = ({ user }) => {
    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    };

    // Format date in a more readable way
    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Card className="user-profile-card">
            <Card.Body>
                <Row className="align-items-center mb-4">
                    <Col xs={12} md="auto" className="text-center mb-3 mb-md-0">
                        <div className="user-avatar">
                            {user.profile_image || user.profileImage ? 
                                <img src={user.profile_image || user.profileImage} alt={`${user.name}'s avatar`} /> :
                                <div className="avatar-placeholder">{getInitials(user.name)}</div>
                            }
                        </div>
                    </Col>
                    <Col xs={12} md>
                        <h2 className="user-name mb-1">{user.name}</h2>
                        <p className="text-muted mb-2">
                            <i className="bi bi-envelope me-2"></i>{user.email}
                        </p>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <Badge bg="light" text="dark" className="user-badge me-2">
                                <i className="bi bi-calendar-check me-1"></i>
                                Joined {formatDate(user.created_at)}
                            </Badge>
                            {/* Only show these stats if they exist */}
                            {user.stats && (
                                <Badge bg="light" text="dark" className="user-badge">
                                    <i className="bi bi-heart-fill me-1"></i>
                                    {user.stats.likes || 0} Liked Items
                                </Badge>
                            )}
                        </div>
                        <div className="mt-3">
                            <Button variant="outline-primary" size="sm" className="me-2">
                                <i className="bi bi-pencil me-1"></i> Edit Profile
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-shield-lock me-1"></i> Change Password
                            </Button>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4" />

                {/* Only show stats section if additional user data is available */}
                {(user.stats || user.likedItems || user.posts) && (
                    <>
                        <Row className="user-stats">
                            <Col xs={6} md={3} className="stat-item text-center">
                                <div className="stat-value">{user.stats?.likes || user.likedItems?.length || 0}</div>
                                <div className="stat-label">Liked Items</div>
                            </Col>
                            <Col xs={6} md={3} className="stat-item text-center">
                                <div className="stat-value">{user.stats?.posts || user.posts?.length || 0}</div>
                                <div className="stat-label">Posts</div>
                            </Col>
                            <Col xs={6} md={3} className="stat-item text-center">
                                <div className="stat-value">{user.stats?.followers || user.followers?.length || 0}</div>
                                <div className="stat-label">Followers</div>
                            </Col>
                            <Col xs={6} md={3} className="stat-item text-center">
                                <div className="stat-value">{user.stats?.following || user.following?.length || 0}</div>
                                <div className="stat-label">Following</div>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                    </>
                )}

                <h4 className="section-title">
                    <i className="bi bi-info-circle me-2"></i>
                    About
                </h4>
                <p className="user-bio mb-4">
                    {user.bio || "No bio information available. Click 'Edit Profile' to add your bio."}
                </p>

                <h4 className="section-title">
                    <i className="bi bi-geo-alt me-2"></i>
                    Location
                </h4>
                <p className="mb-0">
                    {user.location || "Not specified"}
                </p>
            </Card.Body>
        </Card>
    );
};

export default UserInfo;