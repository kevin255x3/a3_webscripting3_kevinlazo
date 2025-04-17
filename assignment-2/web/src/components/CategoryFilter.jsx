// category filter component - provides dropdown to filter books by category
import React, { useState, useEffect } from 'react';
import api from '../services/api';


const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    // state management for categories and ui states
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                // use api service instead of axios directly
                const response = await api.get('/api/categories');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error loading categories');
                setLoading(false);
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    // handle change in the category dropdown
    const handleChange = (e) => {
        onCategoryChange(e.target.value);
    };

    // show loading or error states when needed
    if (loading) return <div>Loading categories...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
                id="category-select"
                value={selectedCategory}
                onChange={handleChange}
                className="category-select"
            >
                <option value="">All Categories</option>
                {/* map through categories to create dropdown options */}
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name} ({category.book_count || 0})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;