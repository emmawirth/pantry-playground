
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import AddItemOverlay from '@/components/AddItemOverlay';
import { toast } from 'sonner';
import { Package, Users, Book } from 'lucide-react';

type TabType = 'dashboard' | 'recipes' | 'add' | 'pantry' | 'feed';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    setIsAddOverlayOpen(true);
  };

  const handleAddMethod = (method: string) => {
    setIsAddOverlayOpen(false);
    toast.success(`${method} feature coming soon!`, {
      description: "This feature will be available in the next update."
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recipes':
        return (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="w-16 h-16 bg-pantry-green/10 text-pantry-green flex items-center justify-center rounded-full mb-4">
              <Book size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Recipe Hub</h2>
            <p className="text-muted-foreground text-center max-w-xs">
              Find and save your favorite recipes here. Coming soon!
            </p>
          </div>
        );
      case 'pantry':
        return (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="w-16 h-16 bg-pantry-green/10 text-pantry-green flex items-center justify-center rounded-full mb-4">
              <Package size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Pantry Management</h2>
            <p className="text-muted-foreground text-center max-w-xs">
              Keep track of all your ingredients and their expiration dates. Coming soon!
            </p>
          </div>
        );
      case 'feed':
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={handleAddClick}
      />
      
      <AddItemOverlay 
        isOpen={isAddOverlayOpen}
        onClose={() => setIsAddOverlayOpen(false)}
        onBarcodeClick={() => handleAddMethod('Barcode Scanner')}
        onReceiptClick={() => handleAddMethod('Receipt Upload')}
        onVoiceClick={() => handleAddMethod('Voice Input')}
        onManualClick={() => handleAddMethod('Manual Entry')}
      />
    </div>
  );
};

export default Index;
