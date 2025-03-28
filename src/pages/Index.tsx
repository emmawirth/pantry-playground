
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

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [pantryItems, setPantryItems] = useState<PantryItemType[]>([]);
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
        return (
          <PantryManagement pantryItems={pantryItems} setPantryItems={setPantryItems} />
        );
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
        userId={user?.id}
      />
    </div>
  );
};

export default Index;
