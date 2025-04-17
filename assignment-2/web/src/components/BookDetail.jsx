import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import config from '../config';


//   bookdetail component - displays full information for a single book

const BookDetail = () => {
    // get book id from url parameters
    const { id } = useParams();
    const navigate = useNavigate();
    // state management for book data and UI states
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch book details when component mounts
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                // use api service instead of axios directly
                const response = await api.get(`/api/books/${id}`);
                setBook(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching book details.');
                setLoading(false);
                console.error('Error fetching book:', err);

                // if 404, redirect to home page after a short delay
                if (err.response && err.response.status === 404) {
                    setTimeout(() => navigate('/'), 3000);
                }
            }
        };

        fetchBook();
    }, [id, navigate]);

    // handle book deletion
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                // use api service instead of axios directly
                await api.delete(`/api/books/${id}`);
                navigate('/');
            } catch (err) {
                setError('Error deleting book. Please try again.');
                console.error('Error deleting book:', err);
            }
        }
    };

    // display loading, error, or not found states
    if (loading) return <div className="loading">Loading book details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div className="not-found">Book not found</div>;

    return (
        <div className="book-detail">
            {/* header section with title and action buttons */}
            <div className="book-detail-header">
                <h1>{book.title}</h1>
                <div className="book-actions">
                    <Link to="/" className="btn btn-secondary">Back to List</Link>
                    <Link to={`/edit-book/${book.id}`} className="btn btn-warning">Edit Book</Link>
                    <button onClick={handleDelete} className="btn btn-danger">Delete Book</button>
                </div>
            </div>

            <div className="book-detail-content">
                {/* book cover image or placeholder */}
                <div className="book-cover">
                    {book.cover_image ? (
                        <img
                            src={`${config.UPLOADS_URL}/${book.cover_image}`}
                            alt={`Cover of ${book.title}`}
                        />
                    ) : (
                        <div className="placeholder-cover"><span>text only</span></div>
                    )}
                </div>

                <div className="book-info">
                    {/* display book metadata in rows */}
                    <div className="info-row">
                        <span className="label">Author:</span>
                        <span className="value">{book.author}</span>
                    </div>

                    <div className="info-row">
                        <span className="label">Category:</span>
                        <span className="value">{book.category_name || 'Uncategorized'}</span>
                    </div>

                    {/* conditionally show publication year if available */}
                    {book.publication_year && (
                        <div className="info-row">
                            <span className="label">Publication Year:</span>
                            <span className="value">{book.publication_year}</span>
                        </div>
                    )}

                    <div className="info-row">
                        <span className="label">Added:</span>
                        <span className="value">
                            {new Date(book.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    {/* show description if available */}
                    {book.description && (
                        <div className="description">
                            <h3>Description</h3>
                            <p>{book.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;