
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

const VerificationNotice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-pantry-green/10 text-pantry-green flex items-center justify-center rounded-full mb-4">
        <MailCheck size={32} />
      </div>
      
      <h2 className="text-xl font-semibold">Verify Your Email</h2>
      
      <p className="text-muted-foreground">
        We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
      </p>
      
      <p className="text-sm text-muted-foreground">
        If you don't see the email, check your spam folder or request another verification email.
      </p>
      
      <div className="pt-4">
        <Button
          onClick={() => navigate('/auth/login')}
          className="bg-pantry-green hover:bg-pantry-green-dark"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default VerificationNotice;
