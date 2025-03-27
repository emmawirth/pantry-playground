
import React, { useState } from 'react';
import { Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from './ui-components/Badge';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  ingredientsAvailable: number;
  dietaryLabels: string[];
  cookingLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  image,
  cookTime,
  ingredientsAvailable,
  dietaryLabels,
  cookingLevel,
  onClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="pantry-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          onClick={handleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
            isFavorite ? "bg-white/90 text-red-500" : "bg-black/20 text-white hover:bg-white/90 hover:text-red-500"
          )}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "currentColor" : "none"} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3 pt-6">
          <div className="flex items-center space-x-2">
            <div className="bg-pantry-fresh text-white text-xs font-medium px-2 py-1 rounded-md">
              {ingredientsAvailable}% Ready
            </div>
            <Badge 
              label={cookingLevel}
              variant="level"
            />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-base line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock size={14} />
            <span className="text-xs">{cookTime} min</span>
          </div>
          <div className="flex space-x-1">
            {dietaryLabels.slice(0, 2).map((label) => (
              <Badge key={label} label={label} variant="dietary" />
            ))}
            {dietaryLabels.length > 2 && (
              <span className="text-xs text-muted-foreground">+{dietaryLabels.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
