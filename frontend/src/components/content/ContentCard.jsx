import React, { useState } from 'react';
import './ContentCard.css'; // We'll create this next

const ContentCard = ({ content, onLike, onComment }) => {
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onComment(content.id, comment);
            setComment('');
        }
    };
    
    // Format date if available
    const formattedDate = content.created_at 
        ? new Date(content.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : null;

    return (
        <div className="content-card">
            {content.image && (
                <div className="content-image">
                    <img 
                        src={`http://127.0.0.1:8000/storage/${content.image}`} 
                        alt={content.title} 
                    />
                </div>
            )}
            
            <div className="content-header">
                <h3>{content.title}</h3>
                {content.user && (
                    <p className="content-author">By: {content.user.name}</p>
                )}
                {formattedDate && (
                    <p className="content-date">{formattedDate}</p>
                )}
            </div>
            
            <div className="content-body">
                <p>{content.content}</p>
            </div>

            <div className="content-actions">
                <button 
                    className="like-button" 
                    onClick={() => onLike(content.id)}
                >
                    {content.likes?.length || 0} Likes
                </button>
                <button 
                    className="comment-toggle-button" 
                    onClick={() => setShowComments(!showComments)}
                >
                    {content.comments?.length || 0} Comments
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <h4>Comments</h4>
                    {content.comments && content.comments.length > 0 ? (
                        <ul className="comments-list">
                            {content.comments.map((comment, index) => (
                                <li key={index} className="comment-item">
                                    <strong>{comment.user?.name || 'User'}: </strong>
                                    {comment.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                    
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                            rows={3}
                            required
                        />
                        <button type="submit" className="submit-button">Post Comment</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContentCard;