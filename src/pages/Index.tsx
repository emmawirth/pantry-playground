
import React, { useState } from 'react';
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

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [pantryItems, setPantryItems] = useState<string[]>([
    'Chicken breast',
    'Rice',
    'Onions',
    'Garlic',
    'Olive oil',
    'Mixed vegetables',
    'Soy sauce',
    'Ginger',
    'Bell peppers',
    'Mushrooms'
  ]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    setIsAddOverlayOpen(true);
  };

  const handleAddItems = (items: string[]) => {
    setPantryItems(prev => [...prev, ...items]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recipes':
        return <RecipeHub />;
      case 'pantry':
        return <PantryManagement />;
      case 'feed':
        return <SocialFeed />;
      default:
        return <Dashboard />;
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
            <ProfileSettings />
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
