import React, { useState } from 'react';
import './CommentSection.css'; // We'll create this next

const CommentSection = ({ comments = [], blogId, onAddComment }) => {
    const [comment, setComment] = useState('');

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(blogId, comment);
            setComment('');
        }
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    required
                    className="comment-textarea"
                />
                <button type="submit" className="comment-button">Submit Comment</button>
            </form>
            
            {comments.length > 0 ? (
                <ul className="comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                            <div className="comment-header">
                                <strong>{comment.user?.name || 'Anonymous'}</strong>
                                {comment.created_at && (
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>
                            <div className="comment-content">{comment.content}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};

export default CommentSection;