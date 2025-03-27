
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'dietary' | 'time' | 'level';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'default',
  className
}) => {
  return (
    <span className={cn(
      "pantry-chip",
      variant === 'default' && "bg-pantry-green/10 text-pantry-green-dark",
      variant === 'outline' && "border border-border bg-transparent text-muted-foreground",
      variant === 'secondary' && "bg-secondary text-secondary-foreground",
      variant === 'dietary' && "bg-pantry-leaf-light text-pantry-leaf-dark",
      variant === 'time' && "bg-muted text-muted-foreground",
      variant === 'level' && "bg-pantry-green/20 text-pantry-green-dark",
      className
    )}>
      {label}
    </span>
  );
};

export default Badge;
