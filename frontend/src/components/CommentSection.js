import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function CommentSection({ taskId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [taskId]);

    const loadComments = async () => {
        try {
            const data = await api.getComments(taskId);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.addComment(taskId, newComment);
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.deleteComment(commentId);
            loadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) return <div className="loading">Loading comments...</div>;

    return (
        <div className="comment-section">
            <h3>Comments ({comments.length})</h3>

            <form className="comment-form" onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="2"
                    required
                />
                <button type="submit" className="btn btn-primary btn-small">
                    Add Comment
                </button>
            </form>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <p>{comment.content}</p>
                            <div className="comment-meta">
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                                <button
                                    className="btn btn-small btn-danger"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;
