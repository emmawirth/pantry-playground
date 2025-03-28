
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
import { supabase } from '@/integrations/supabase/client';

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

  // Add some expiring items when the component first loads
  useEffect(() => {
    const addPantryItemsToDb = async () => {
      if (!user?.id) return;
      
      // Check if we've already added items
      const { data: existingItems } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id);
      
      // Only add sample items if the user has fewer than 3 items
      if (existingItems && existingItems.length > 13) return;
      
      // Calculate expiration dates
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      const threeDaysFormatted = `${threeDaysFromNow.getMonth() + 1}/${threeDaysFromNow.getDate()}/${threeDaysFromNow.getFullYear()}`;
      
      const fiveDaysFromNow = new Date();
      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
      const fiveDaysFormatted = `${fiveDaysFromNow.getMonth() + 1}/${fiveDaysFromNow.getDate()}/${fiveDaysFromNow.getFullYear()}`;
      
      const sixDaysFromNow = new Date();
      sixDaysFromNow.setDate(sixDaysFromNow.getDate() + 6);
      const sixDaysFormatted = `${sixDaysFromNow.getMonth() + 1}/${sixDaysFromNow.getDate()}/${sixDaysFromNow.getFullYear()}`;
      
      const tenDaysFromNow = new Date();
      tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
      const tenDaysFormatted = `${tenDaysFromNow.getMonth() + 1}/${tenDaysFromNow.getDate()}/${tenDaysFromNow.getFullYear()}`;
      
      const twentyDaysFromNow = new Date();
      twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);
      const twentyDaysFormatted = `${twentyDaysFromNow.getMonth() + 1}/${twentyDaysFromNow.getDate()}/${twentyDaysFromNow.getFullYear()}`;
      
      // Create variety of pantry items (some expiring soon, some fresh)
      const pantryItems = [
        // Expiring items (within a week)
        {
          name: 'Fresh Milk',
          brand: 'Organic Valley',
          quantity: '1 gallon',
          expiration_date: threeDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        {
          name: 'Strawberries',
          brand: 'Driscoll\'s',
          quantity: '16 oz package',
          expiration_date: threeDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        {
          name: 'Ground Beef',
          brand: 'Certified Angus',
          quantity: '1 lb package',
          expiration_date: threeDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        {
          name: 'Yogurt',
          brand: 'Chobani',
          quantity: '32 oz container',
          expiration_date: fiveDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        {
          name: 'Fresh Spinach',
          brand: 'Earthbound Farm',
          quantity: '5 oz bag',
          expiration_date: fiveDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        {
          name: 'Chicken Breasts',
          brand: 'Perdue',
          quantity: '1.5 lbs',
          expiration_date: sixDaysFormatted,
          expiration_status: 'expiring',
          user_id: user.id
        },
        // Fresh items
        {
          name: 'Eggs',
          brand: 'Happy Hens',
          quantity: '12 count',
          expiration_date: tenDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Cheddar Cheese',
          brand: 'Tillamook',
          quantity: '8 oz block',
          expiration_date: tenDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Butter',
          brand: 'Kerrygold',
          quantity: '8 oz',
          expiration_date: tenDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Carrots',
          brand: 'Organic',
          quantity: '1 lb bag',
          expiration_date: tenDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Potatoes',
          brand: 'Russet',
          quantity: '5 lb bag',
          expiration_date: twentyDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Onions',
          brand: 'Sweet Vidalia',
          quantity: '3 lb bag',
          expiration_date: twentyDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        },
        {
          name: 'Pasta',
          brand: 'Barilla',
          quantity: '16 oz box',
          expiration_date: twentyDaysFormatted,
          expiration_status: 'fresh',
          user_id: user.id
        }
      ];
      
      const { error } = await supabase
        .from('pantry_items')
        .insert(pantryItems);
      
      if (error) {
        console.error('Error adding pantry items:', error);
        toast.error('Failed to add pantry items');
      } else {
        toast.success('Added variety of pantry items to your inventory');
        console.log('Successfully added pantry items to database');
      }
    };
    
    // Force-add items when the component loads
    addPantryItemsToDb();
  }, [user]);

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pantrypal_filters', JSON.stringify(filterOptions));
  }, [filterOptions]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // If user navigates to the pantry tab, make sure to reload pantry items
    if (tab === 'pantry') {
      // Switch to pantry tab right away
      console.log('Switching to pantry tab');
    }
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
