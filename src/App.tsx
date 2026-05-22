import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import WritePage from "./pages/write/WritePage";
import FeedPage from "./pages/feed/FeedPage";
import MyPostsPage from "./pages/myPosts/MyPostsPage";
import PostPage from "./pages/post/PostPage";
import EditPostPage from "./pages/post/EditPostPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ContactPage from "./pages/contact/ContactPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            

            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <MyPostsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:username" element={<ProfilePage />} />

            <Route
              path="/edit/:slug"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
