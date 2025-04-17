// book list component - displays all books with filtering options
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

const BookList = () => {
    // get current user from auth context
    const { user } = useContext(AuthContext);

    // state management for books and ui states
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // fetch books when component mounts or filters change
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);

                // build query parameters for filtering
                let queryParams = '';
                if (selectedCategory) {
                    queryParams += `categoryId=${selectedCategory}`;
                }
                if (searchTerm) {
                    queryParams += queryParams ? `&search=${searchTerm}` : `search=${searchTerm}`;
                }

                // use api service instead of axios directly
                const url = `/api/books${queryParams ? `?${queryParams}` : ''}`;
                const response = await api.get(url);

                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching books. Please try again.');
                setLoading(false);
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, [selectedCategory, searchTerm]);

    // handle category change from the filter component
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // handle book deletion
    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                // use api service instead of axios directly
                await api.delete(`/api/books/${id}`);
                // remove the deleted book from the state
                setBooks(books.filter(book => book.id !== id));
            } catch (err) {
                setError('Error deleting book. Please try again.');
                console.error('Error deleting book:', err);
            }
        }
    };

    return (
        <div className="book-list">
            <h1>memory.</h1>

            <div className="book-filters">
                {/* search input */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                {/* category filter component */}
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </div>

            <div className="add-book-button">
                <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
            </div>

            {/* conditional rendering based on loading/error states */}
            {loading ? (
                <div className="loading">Loading books...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : books.length === 0 ? (
                <div className="no-books">
                    No books found. Try changing your filters or add a new book.
                </div>
            ) : (
                <div className="books-grid">
                    {/* map through books array to create cards */}
                    {books.map(book => (
                        <div key={book.id} className="book-card">
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
                                <h3 className="book-title">
                                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                                </h3>
                                <p className="book-author">by {book.author}</p>
                                <p className="book-category">
                                    Category: {book.category_name || 'Uncategorized'}
                                </p>
                                <p className="book-year">
                                    {book.publication_year && `Published: ${book.publication_year}`}
                                </p>
                            </div>

                            <div className="book-actions">
                                <Link to={`/books/${book.id}`} className="btn btn-info">View</Link>
                                <Link to={`/edit-book/${book.id}`} className="btn btn-warning">Edit</Link>
                                <button
                                    onClick={() => handleDeleteBook(book.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookList;