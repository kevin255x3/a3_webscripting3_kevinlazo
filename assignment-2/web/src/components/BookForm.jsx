import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import config from '../config';

// book form component - handles both adding and editing books
// reuses the same form interface for both operations
const BookForm = ({ isEditing = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    // form state for book data
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        publication_year: '',
        category_id: '',
        cover_image: null
    });

    // preview image for selected cover
    const [imagePreview, setImagePreview] = useState(null);

    // ui state management 
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // fetch categories and book data (if editing) when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // fetch categories for dropdown selection
                const categoryResponse = await api.get('/api/categories');
                setCategories(categoryResponse.data);

                // if editing, fetch the book data to populate form
                if (isEditing && id) {
                    const bookResponse = await api.get(`/api/books/${id}`);
                    const book = bookResponse.data;

                    setFormData({
                        title: book.title || '',
                        author: book.author || '',
                        description: book.description || '',
                        publication_year: book.publication_year || '',
                        category_id: book.category_id || '',
                    });

                    // set image preview if book has a cover
                    if (book.cover_image) {
                        setImagePreview(`${config.UPLOADS_URL}/${book.cover_image}`);
                    }
                }

                setLoading(false);
            } catch (err) {
                setError('Error loading data. Please try again.');
                setLoading(false);
                console.error('Error fetching data:', err);

                // redirect on unauthorized or not found
                if (err.response && (err.response.status === 401 || err.response.status === 404)) {
                    navigate('/');
                }
            }
        };

        fetchData();
    }, [isEditing, id, navigate]);

    // update form state when inputs change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // handle file selection and generate preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, cover_image: file });

            // create preview url for display
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // handle form submission - create or update book
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            // create formdata for multipart file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('description', formData.description);
            data.append('publication_year', formData.publication_year);
            data.append('category_id', formData.category_id);

            // only include cover image if a new file was selected
            if (formData.cover_image instanceof File) {
                data.append('cover_image', formData.cover_image);
            }

            let response;
            if (isEditing) {
                // update existing book
                response = await api.put(`/api/books/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // create new book
                response = await api.post('/api/books', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setSuccess(true);
            setLoading(false);

            // navigate to book detail after success
            setTimeout(() => {
                navigate(`/books/${response.data.id}`);
            }, 1500);
        } catch (err) {
            setError('Error saving book. Please try again.');
            setLoading(false);
            console.error('Error saving book:', err);
        }
    };

    // show loading indicator while initial data loads
    if (loading && !isEditing) return <div className="loading">Loading...</div>;

    return (
        <div className="book-form">
            <h1>{isEditing ? 'Edit Book' : 'Add New Book'}</h1>

            {/* status messages */}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">Book saved successfully! Redirecting...</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter book title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author*</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        placeholder="Enter author name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Enter book description"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="publication_year">Publication Year</label>
                    <input
                        type="number"
                        id="publication_year"
                        name="publication_year"
                        value={formData.publication_year}
                        onChange={handleChange}
                        placeholder="YYYY"
                        min="1000"
                        max={new Date().getFullYear()}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category_id">Category</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="cover_image">Cover Image</label>
                    <input
                        type="file"
                        id="cover_image"
                        name="cover_image"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/jpg"
                    />

                    {/* show image preview when available */}
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Cover preview" />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;