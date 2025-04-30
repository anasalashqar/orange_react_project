import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ContentPage from './pages/ContentPage';
import BlogPostPage from './pages/BlogPostPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import './App.css';

function App() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/content" element={<ContentPage />} />
          
          {/* Blog routes */}
          <Route path="/blogs/:id" element={<BlogPostPage />} />
          <Route path="/create-blog" element={<CreateBlogPage />} />
          <Route path="/edit-blog/:id" element={<EditBlogPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;