import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}
