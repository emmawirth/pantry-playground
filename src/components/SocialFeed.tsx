
import React from 'react';
import { Users } from 'lucide-react';

const SocialFeed: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="w-16 h-16 bg-pantry-green/10 text-pantry-green flex items-center justify-center rounded-full mb-4">
        <Users size={32} />
      </div>
      <h2 className="text-xl font-semibold mb-2">Social Feed</h2>
      <p className="text-muted-foreground text-center max-w-xs">
        Connect with friends and discover community recipes. Coming soon!
      </p>
    </div>
  );
};

export default SocialFeed;
