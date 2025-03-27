
import React from 'react';
import { Utensils, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type ExpirationStatus = 'fresh' | 'expiring' | 'expired';

interface PantryItemProps {
  id: string;
  name: string;
  brand: string;
  quantity: string;
  expirationDate: string;
  expirationStatus: ExpirationStatus;
  image?: string;
  onFindRecipes: () => void;
}

const PantryItem: React.FC<PantryItemProps> = ({
  id,
  name,
  brand,
  quantity,
  expirationDate,
  expirationStatus,
  image,
  onFindRecipes,
}) => {
  return (
    <div className="pantry-card p-3 flex items-center space-x-3">
      <div 
        className={cn(
          "w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center",
          expirationStatus === 'fresh' && "bg-pantry-green/10",
          expirationStatus === 'expiring' && "bg-pantry-warning/10",
          expirationStatus === 'expired' && "bg-pantry-expired/10",
        )}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Heart 
            size={24} 
            className={cn(
              expirationStatus === 'fresh' && "text-pantry-green",
              expirationStatus === 'expiring' && "text-pantry-warning",
              expirationStatus === 'expired' && "text-pantry-expired",
            )} 
          />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm text-muted-foreground">
            {brand} • {quantity}
          </div>
          <div 
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              expirationStatus === 'fresh' && "bg-pantry-green/10 text-pantry-green",
              expirationStatus === 'expiring' && "bg-pantry-warning/10 text-pantry-warning",
              expirationStatus === 'expired' && "bg-pantry-expired/10 text-pantry-expired",
            )}
          >
            {expirationStatus === 'fresh' && "Fresh"}
            {expirationStatus === 'expiring' && `Expires ${expirationDate}`}
            {expirationStatus === 'expired' && `Expired ${expirationDate}`}
          </div>
        </div>
      </div>
      
      <button 
        onClick={onFindRecipes}
        className="p-2 bg-pantry-green/10 text-pantry-green hover:bg-pantry-green hover:text-white rounded-full transition-colors"
      >
        <Utensils size={18} />
      </button>
    </div>
  );
};

export default PantryItem;
