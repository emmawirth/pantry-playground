
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Info, ArrowDown, ArrowUp, Trash2, Filter, Check } from 'lucide-react';
import PantryItem from './PantryItem';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

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

interface PantryManagementProps {
  pantryItems: PantryItemType[];
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItemType[]>>;
}

type SortDirection = 'none' | 'asc' | 'desc';
type SortType = 'name' | 'date';

const PantryManagement: React.FC<PantryManagementProps> = ({ pantryItems, setPantryItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFoodBankModal, setShowFoodBankModal] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [foodBanks, setFoodBanks] = useState<any[]>([]);
  const [showDonateItemsModal, setShowDonateItemsModal] = useState(false);
  const [itemsToDonate, setItemsToDonate] = useState<PantryItemType[]>([]);
  const [sortConfig, setSortConfig] = useState<{type: SortType, direction: SortDirection}>({
    type: 'name',
    direction: 'none'
  });
  
  const handleItemSelection = (id: string) => {
    setPantryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
    toast.success('Item removed from pantry');
  };
  
  const selectedCount = pantryItems.filter(item => item.selected).length;
  
  const handleFindRecipe = () => {
    const selectedItems = pantryItems.filter(item => item.selected);
    
    if (selectedItems.length < 2) {
      toast.error('Please select at least 2 items');
      return;
    }
    
    // Simulate API call for recipe suggestions
    toast.success('Finding recipes for you', {
      description: `Using ${selectedItems.length} selected ingredients`,
    });
    
    setTimeout(() => {
      // Random success or failure response
      if (Math.random() > 0.3) {
        toast.success('Recipes found!', {
          description: 'Check the Recipes tab for suggestions.'
        });
      } else {
        toast.error('No recipe found', {
          description: 'Oops! Looks like there is no recipe for this food combination. Please try again!'
        });
      }
    }, 2000);
  };
  
  const handleOpenDonateModal = () => {
    // Filter items that expire within a week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const expiringItems = pantryItems.filter(item => {
      if (item.expirationStatus === 'expiring') {
        const expiryDate = new Date(item.expirationDate);
        return expiryDate <= oneWeekFromNow;
      }
      return false;
    });
    
    if (expiringItems.length === 0) {
      toast.info('No items expiring within a week to donate');
      return;
    }
    
    setItemsToDonate(expiringItems.map(item => ({ ...item, selected: false })));
    setShowDonateItemsModal(true);
  };
  
  const toggleDonatableItem = (id: string) => {
    setItemsToDonate(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  
  const handleDonateSelected = () => {
    const selectedDonationItems = itemsToDonate.filter(item => item.selected);
    
    if (selectedDonationItems.length === 0) {
      toast.error('Please select at least one item to donate');
      return;
    }
    
    setShowDonateItemsModal(false);
    setShowFoodBankModal(true);
  };
  
  const searchFoodBanks = () => {
    if (!zipCode || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      toast.error('Please enter a valid 5-digit zip code');
      return;
    }
    
    // Simulate API call to find nearby food banks
    setFoodBanks([
      { id: 1, name: 'Community Food Bank', address: '123 Main St, Anytown, USA', distance: '1.2 miles' },
      { id: 2, name: 'Hope Food Pantry', address: '456 Oak Ave, Anytown, USA', distance: '2.5 miles' },
      { id: 3, name: 'Feeding Families Center', address: '789 Elm St, Anytown, USA', distance: '3.1 miles' },
    ]);
  };

  const handleSort = (type: SortType) => {
    let newDirection: SortDirection = 'asc';
    
    if (sortConfig.type === type) {
      // Toggle direction if same type
      if (sortConfig.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortConfig.direction === 'desc') {
        newDirection = 'none';
      }
    }
    
    setSortConfig({ type, direction: newDirection });
  };
  
  // Sort logic for pantry items
  const getSortedItems = () => {
    if (sortConfig.direction === 'none') {
      return [...pantryItems];
    }
    
    return [...pantryItems].sort((a, b) => {
      if (sortConfig.type === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      } else if (sortConfig.type === 'date') {
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        const comparison = dateA.getTime() - dateB.getTime();
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  };
  
  // Filter and sort items
  const filteredItems = getSortedItems().filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const clearSelections = () => {
    setPantryItems(items => items.map(item => ({ ...item, selected: false })));
  };
  
  const expiringItemsCount = pantryItems.filter(item => item.expirationStatus === 'expiring').length;
  
  return (
    <div className="pb-24">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold mb-6">Pantry Management</h1>
        
        {expiringItemsCount > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-amber-800">{expiringItemsCount} items expiring soon</p>
                <p className="text-sm text-amber-700">Help reduce food waste by donating</p>
              </div>
              <Button 
                onClick={handleOpenDonateModal}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Donate Now
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative mb-6">
          <input 
            type="text"
            placeholder="Search pantry items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pantry-green/30 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>

        {/* Sort filters with labels */}
        <div className="flex items-center mb-4">
          <span className="text-sm text-muted-foreground mr-2">Filter items by:</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={() => handleSort('name')}
            >
              Name
              {sortConfig.type === 'name' && sortConfig.direction === 'asc' && (
                <ArrowDown className="h-4 w-4" />
              )}
              {sortConfig.type === 'name' && sortConfig.direction === 'desc' && (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={() => handleSort('date')}
            >
              Expiration date
              {sortConfig.type === 'date' && sortConfig.direction === 'asc' && (
                <ArrowDown className="h-4 w-4" />
              )}
              {sortConfig.type === 'date' && sortConfig.direction === 'desc' && (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {selectedCount > 0 && (
          <div className="bg-pantry-green/10 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="font-medium">{selectedCount} items selected</p>
              <p className="text-sm text-muted-foreground">Select ingredients to find recipes</p>
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearSelections}
              >
                Clear
              </Button>
              <Button 
                onClick={handleFindRecipe}
                size="sm"
                className="bg-pantry-green hover:bg-pantry-green-dark"
              >
                Find Recipe
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">No items found in your pantry</p>
              <p className="text-sm">Add items using the + button</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`${item.selected ? 'border-pantry-green bg-pantry-green/5' : ''} border rounded-lg transition-colors`}
              >
                <div className="flex items-center">
                  <Checkbox
                    id={`select-${item.id}`}
                    checked={item.selected}
                    onCheckedChange={() => handleItemSelection(item.id)}
                    className="ml-3 mr-1 data-[state=checked]:bg-pantry-green"
                  />
                  <div className="flex-1">
                    <PantryItem
                      id={item.id}
                      name={item.name}
                      brand={item.brand}
                      quantity={item.quantity}
                      expirationDate={item.expirationDate}
                      expirationStatus={item.expirationStatus}
                      onFindRecipes={() => handleItemSelection(item.id)}
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="mr-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Donate Items Modal */}
      <Dialog open={showDonateItemsModal} onOpenChange={setShowDonateItemsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Items to Donate</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-muted-foreground">
              Choose items from your pantry that you'd like to donate. These items are expiring soon.
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {itemsToDonate.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Checkbox 
                    id={`donate-${item.id}`}
                    checked={item.selected}
                    onCheckedChange={() => toggleDonatableItem(item.id)}
                    className="data-[state=checked]:bg-pantry-green"
                  />
                  <div className="flex-1">
                    <label htmlFor={`donate-${item.id}`} className="flex flex-col cursor-pointer">
                      <span className="font-medium">{item.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {item.brand} • {item.quantity}
                      </div>
                      <div className="text-xs text-amber-600">
                        Expires {item.expirationDate}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowDonateItemsModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDonateSelected}
                className="bg-pantry-green hover:bg-pantry-green-dark"
              >
                Find Food Banks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Food Bank Modal */}
      <Dialog open={showFoodBankModal} onOpenChange={setShowFoodBankModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Find Nearby Food Banks</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-muted-foreground">
              Enter your zip code to find food banks in your area where you can donate excess pantry items.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={5}
              />
              <Button onClick={searchFoodBanks}>Search</Button>
            </div>
            
            {foodBanks.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="font-medium">Nearby Food Banks:</h3>
                <div className="bg-gray-100 p-4 rounded-lg border">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <MapPin size={32} className="text-muted-foreground" />
                  </div>
                  
                  {foodBanks.map(bank => (
                    <div key={bank.id} className="py-2 border-b last:border-b-0">
                      <h4 className="font-medium">{bank.name}</h4>
                      <p className="text-sm text-muted-foreground">{bank.address}</p>
                      <p className="text-xs text-pantry-green">{bank.distance} away</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  <Info size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                  <p>
                    Call ahead to confirm donation hours and accepted items. Many food banks have specific guidelines for accepting perishable items.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PantryManagement;
