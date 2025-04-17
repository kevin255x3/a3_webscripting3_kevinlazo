// main app component - sets up routing and application structure
// provides layout and protected routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// import components
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// import auth context provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* global navigation component */}
          <Navbar />

          <main className="container">
            <Routes>
              {/* public routes - accessible without authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* protected routes - require authentication */}
              <Route path="/" element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              } />

              {/* book detail view route */}
              <Route path="/books/:id" element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              } />

              {/* add new book route */}
              <Route path="/add-book" element={
                <ProtectedRoute>
                  <BookForm isEditing={false} />
                </ProtectedRoute>
              } />

              {/* edit existing book route */}
              <Route path="/edit-book/:id" element={
                <ProtectedRoute>
                  <BookForm isEditing={true} />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          {/* application footer */}
          <footer className="App-footer">
            <p>books books books</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;