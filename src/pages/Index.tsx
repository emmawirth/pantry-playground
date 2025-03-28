
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import RecipeHub from '@/components/RecipeHub';
import PantryManagement from '@/components/PantryManagement';
import SocialFeed from '@/components/SocialFeed';
import ProfileSettings from '@/components/ProfileSettings';
import AddItemOverlay from '@/components/AddItemOverlay';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type TabType = 'dashboard' | 'recipes' | 'add' | 'pantry' | 'feed';

export interface FilterOptions {
  skill: 'Beginner' | 'Intermediate' | 'Expert' | null;
  time: '0-20' | '20-40' | '40-60' | '60+' | null;
  diet: string | null;
}

interface PantryItemType {
  id: string;
  name: string;
  brand: string;
  quantity: string;
  expirationDate: string;
  expirationStatus: 'fresh' | 'expiring' | 'expired';
  image?: string;
  selected: boolean;
}

const generateDemoItems = (): PantryItemType[] => {
  const brands = ['Organic Valley', 'Heinz', 'Kraft', 'General Mills', 'Kellogg\'s', 'Campbell\'s', 'Nestlé', 'Tyson', 'Barilla', 'Whole Foods'];
  const names = ['Milk', 'Eggs', 'Bread', 'Chicken Breast', 'Rice', 'Pasta', 'Tomato Sauce', 'Beans', 'Cereal', 'Yogurt', 'Apple Juice', 'Cheese', 'Ground Beef', 'Salmon', 'Spinach', 'Bell Peppers', 'Onions', 'Garlic', 'Potatoes', 'Carrots', 'Bananas', 'Apples', 'Oranges', 'Strawberries', 'Blueberries', 'Almonds', 'Peanut Butter', 'Jelly', 'Flour', 'Sugar'];
  const quantities = ['1 gallon', '12 count', '1 loaf', '2 lbs', '5 lbs', '16 oz', '24 oz', '15 oz can', '18 oz box', '32 oz', '64 fl oz', '8 oz', '1 lb', '1 lb', '10 oz bag', '3 count', '2 lb bag', '1 bulb', '5 lb bag', '2 lb bag', '1 bunch', '6 count', '4 count', '1 pint', '6 oz', '12 oz bag', '16 oz jar', '12 oz jar', '5 lb bag', '4 lb bag'];
  
  const items: PantryItemType[] = [];
  
  // Create demo items with varied expiration statuses
  for (let i = 0; i < 30; i++) {
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomQuantity = quantities[Math.floor(Math.random() * quantities.length)];
    
    // Determine expiration status and date
    const statusRandom = Math.random();
    let expirationStatus: 'fresh' | 'expiring' | 'expired';
    let expirationDate: string;
    
    if (statusRandom < 0.6) {
      expirationStatus = 'fresh';
      const days = Math.floor(Math.random() * 30) + 20; // 20-50 days in the future
      const date = new Date();
      date.setDate(date.getDate() + days);
      expirationDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } else if (statusRandom < 0.85) {
      expirationStatus = 'expiring';
      const days = Math.floor(Math.random() * 6) + 1; // 1-7 days in the future
      const date = new Date();
      date.setDate(date.getDate() + days);
      expirationDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } else {
      expirationStatus = 'expired';
      const days = Math.floor(Math.random() * 10) + 1; // 1-10 days in the past
      const date = new Date();
      date.setDate(date.getDate() - days);
      expirationDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    
    items.push({
      id: `item-${i}`,
      name: randomName,
      brand: randomBrand,
      quantity: randomQuantity,
      expirationDate,
      expirationStatus,
      selected: false,
    });
  }
  
  return items;
};

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [pantryItems, setPantryItems] = useState<PantryItemType[]>(generateDemoItems());
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
    const savedFilters = localStorage.getItem('pantrypal_filters');
    return savedFilters ? JSON.parse(savedFilters) : {
      skill: null,
      time: '20-40',
      diet: 'No preference',
    };
  });

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pantrypal_filters', JSON.stringify(filterOptions));
  }, [filterOptions]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    setIsAddOverlayOpen(true);
  };

  const handleAddItems = (items: {name: string, brand: string, quantity: string}[]) => {
    const newItems = items.map(item => {
      // Generate expiration date (random future date)
      const days = Math.floor(Math.random() * 30) + 15;
      const date = new Date();
      date.setDate(date.getDate() + days);
      const expirationDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
      // Determine expiration status based on date
      let expirationStatus: 'fresh' | 'expiring' | 'expired';
      if (days > 14) {
        expirationStatus = 'fresh';
      } else if (days > 0) {
        expirationStatus = 'expiring';
      } else {
        expirationStatus = 'expired';
      }
      
      return {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        expirationDate,
        expirationStatus,
        selected: false,
      };
    });
    
    setPantryItems(prev => [...prev, ...newItems]);
    toast.success(`${items.length} items added to pantry`);
  };

  const handleToggleFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId) 
        : [...prev, recipeId]
    );
  };

  const updateFilterOptions = (newOptions: FilterOptions) => {
    setFilterOptions(newOptions);
    // Save to localStorage
    localStorage.setItem('pantrypal_filters', JSON.stringify(newOptions));
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            favoriteRecipes={favoriteRecipes} 
            onToggleFavorite={handleToggleFavorite}
            filterOptions={filterOptions}
            onUpdateFilterOptions={updateFilterOptions}
          />
        );
      case 'recipes':
        return (
          <RecipeHub 
            favoriteRecipes={favoriteRecipes} 
            onToggleFavorite={handleToggleFavorite}
            pantryItems={pantryItems.map(item => item.name)}
          />
        );
      case 'pantry':
        return <PantryManagement pantryItems={pantryItems} setPantryItems={setPantryItems} />;
      case 'feed':
        return <SocialFeed />;
      default:
        return (
          <Dashboard 
            favoriteRecipes={favoriteRecipes} 
            onToggleFavorite={handleToggleFavorite}
            filterOptions={filterOptions}
            onUpdateFilterOptions={updateFilterOptions}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-40 p-4">
        <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
          <DialogTrigger asChild>
            <button className="w-10 h-10 bg-pantry-green/10 rounded-full flex items-center justify-center">
              <User className="text-pantry-green" size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-full h-[90vh] p-0 sm:max-w-full">
            <ProfileSettings 
              favoriteRecipes={favoriteRecipes}
              onToggleFavorite={handleToggleFavorite}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {renderActiveTab()}
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={handleAddClick}
      />
      
      <AddItemOverlay 
        isOpen={isAddOverlayOpen}
        onClose={() => setIsAddOverlayOpen(false)}
        onAddItems={handleAddItems}
      />
    </div>
  );
};

export default Index;
