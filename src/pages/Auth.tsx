
import React from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import VerificationNotice from '@/components/auth/VerificationNotice';
import { Utensils } from 'lucide-react';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which form to show based on the current path
  const getTitle = () => {
    if (location.pathname.includes('/signup')) return 'Create Account';
    if (location.pathname.includes('/forgot-password')) return 'Reset Password';
    if (location.pathname.includes('/verification')) return 'Verify Email';
    return 'Welcome Back';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-pantry-green rounded-full flex items-center justify-center mb-4">
              <Utensils className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">PantryPal</h1>
            <p className="text-muted-foreground">Manage your pantry smartly</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-center">{getTitle()}</h2>
            </div>

            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/verification" element={<VerificationNotice />} />
            </Routes>
          </div>
        </div>
      </div>

      {location.pathname === '/auth' && (
        <div className="p-8 flex justify-center">
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-pantry-green hover:bg-pantry-green-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            GET STARTED
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
