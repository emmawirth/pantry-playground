
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });

      if (error) {
        toast.error('Password reset failed', {
          description: error.message,
        });
      } else {
        setSubmitted(true);
        toast.success('Reset link sent', {
          description: 'Check your email for a password reset link',
        });
      }
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      toast.error('Password reset failed', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Check Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a password reset link to <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Didn't receive an email? Check your spam folder or request another link.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mr-2"
          >
            Try Again
          </Button>
          <Button
            onClick={() => navigate('/auth/login')}
            className="bg-pantry-green hover:bg-pantry-green-dark"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/90"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-pantry-green hover:bg-pantry-green-dark transition-colors"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <div className="text-center mt-4">
        <p className="text-muted-foreground">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-pantry-green hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
