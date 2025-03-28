
import React from 'react';
import { Home, Book, Plus, Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'recipes' | 'add' | 'pantry' | 'feed';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange,
  onAddClick
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} /> },
    { id: 'recipes', label: 'Recipes', icon: <Book size={24} /> },
    { id: 'add', label: 'Add', icon: <Plus size={28} /> },
    { id: 'pantry', label: 'Pantry', icon: <Package size={24} /> },
    { id: 'feed', label: 'Feed', icon: <Users size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 pb-2 pt-1 z-30">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.id === 'add' ? onAddClick() : onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200",
              tab.id === 'add' && "relative",
              tab.id === activeTab && tab.id !== 'add' && "text-pantry-green"
            )}
          >
            {tab.id === 'add' ? (
              <div className="bg-pantry-green text-white p-3 rounded-full shadow-lg -mt-5 hover:bg-pantry-green-dark transition-colors">
                {tab.icon}
              </div>
            ) : (
              <>
                <div className="mb-0.5">{tab.icon}</div>
                <span className="text-xs font-medium">{tab.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
