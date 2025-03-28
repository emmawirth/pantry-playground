
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const SignupForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasCapital && hasSpecial;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('Password does not meet requirements');
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast.error('Sign up failed', {
          description: error.message,
        });
      } else {
        toast.success('Account created successfully!', {
          description: 'You will receive an email shortly to verify your account.',
        });
        navigate('/auth/verification');
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      toast.error('Sign up failed', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="bg-white/90"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="bg-white/90"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/90"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/90"
        />
        
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-muted-foreground font-medium">Password requirements:</p>
          <div className="flex items-center">
            {hasMinLength ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            )}
            <span className={hasMinLength ? "text-green-700" : "text-muted-foreground"}>
              Minimum 8 characters
            </span>
          </div>
          <div className="flex items-center">
            {hasCapital ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            )}
            <span className={hasCapital ? "text-green-700" : "text-muted-foreground"}>
              One capital letter
            </span>
          </div>
          <div className="flex items-center">
            {hasSpecial ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            )}
            <span className={hasSpecial ? "text-green-700" : "text-muted-foreground"}>
              One special character (e.g., !, @, $)
            </span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !isPasswordValid}
        className="w-full bg-pantry-green hover:bg-pantry-green-dark transition-colors mt-4"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center mt-4">
        <p className="text-muted-foreground">
          Already have an account?{' '}
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

export default SignupForm;
