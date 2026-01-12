import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { HomePage } from './app/HomePage';
import { LoginPage } from './app/LoginPage';
import { RegisterPage } from './app/RegisterPage';
import { VerifyOtpPage } from './app/VerifyOtpPage';
import { ForgotPasswordPage } from './app/ForgotPasswordPage';
import { ResetPasswordPage } from './app/ResetPasswordPage';
import { ChatPage } from './app/ChatPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
