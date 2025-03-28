
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InfoCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        toast.error('Login failed', {
          description: error.message,
        });
        console.error('Login error:', error);
      } else {
        toast.success('Login successful', {
          description: 'Welcome back!',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('Login failed', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="rounded-md bg-blue-50 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InfoCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Test account available: emmawirth4@gmail.com / Testing123!
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          type="email"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-white/90"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button 
            type="button" 
            onClick={() => navigate('/auth/forgot-password')}
            className="text-sm text-pantry-green hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/90"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-pantry-green hover:bg-pantry-green-dark transition-colors"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </Button>

      <div className="text-center mt-4">
        <p className="text-muted-foreground">
          Not a member?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/signup')}
            className="text-pantry-green hover:underline"
          >
            Sign up now!
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

