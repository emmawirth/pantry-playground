
import React, { useState } from 'react';
import { X, Scan, Receipt, Mic, PenSquare, Check, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddItemOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: {name: string, brand: string, quantity: string}[]) => void;
}

type InputMethod = 'barcode' | 'receipt' | 'voice' | 'manual' | null;

const AddItemOverlay: React.FC<AddItemOverlayProps> = ({
  isOpen,
  onClose,
  onAddItems,
}) => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [detectedItems, setDetectedItems] = useState<{ name: string; brand: string; quantity: string; selected: boolean }[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleMethodSelect = (method: InputMethod) => {
    setInputMethod(method);
    setDetectedItems([]);
    setManualInput('');
    
    // Simulate item detection for different methods
    if (method === 'barcode') {
      simulateBarcodeScanning();
    } else if (method === 'receipt') {
      simulateReceiptUpload();
    } else if (method === 'voice') {
      simulateVoiceRecording();
    }
  };

  const simulateBarcodeScanning = () => {
    setIsLoading(true);
    // Simulate a delay for scanning
    setTimeout(() => {
      setDetectedItems([
        { name: 'Campbell\'s Tomato Soup', brand: 'Campbell\'s', quantity: '10.75 oz can', selected: true },
        { name: 'Heinz Ketchup', brand: 'Heinz', quantity: '20 oz bottle', selected: true },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const simulateReceiptUpload = () => {
    setIsLoading(true);
    // Simulate a delay for processing receipt
    setTimeout(() => {
      setDetectedItems([
        { name: 'Organic Bananas', brand: 'Chiquita', quantity: '1 bunch', selected: true },
        { name: 'Almond Milk', brand: 'Silk', quantity: '0.5 gal', selected: true },
        { name: 'Whole Wheat Bread', brand: 'Nature\'s Own', quantity: '1 loaf', selected: true },
        { name: 'Greek Yogurt', brand: 'Fage', quantity: '32 oz tub', selected: true },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setDetectedItems([
        { name: 'Apples', brand: 'Gala', quantity: '6 count', selected: true },
        { name: 'Chicken Breast', brand: 'Perdue', quantity: '1 lb', selected: true },
        { name: 'Spinach', brand: 'Organic', quantity: '10 oz bag', selected: true },
      ]);
    }, 3000);
  };

  const handleManualSearch = () => {
    if (!manualInput.trim()) return;
    
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      const suggestions = [
        { name: manualInput, brand: 'Generic', quantity: '1 item', selected: true },
        { name: `Organic ${manualInput}`, brand: 'Organic', quantity: '1 item', selected: false },
        { name: `${manualInput} (Fresh)`, brand: 'Fresh Market', quantity: '1 item', selected: false },
      ];
      setDetectedItems(suggestions);
      setIsLoading(false);
      setManualInput('');
    }, 500);
  };

  const toggleItemSelection = (index: number) => {
    const updatedItems = [...detectedItems];
    updatedItems[index].selected = !updatedItems[index].selected;
    setDetectedItems(updatedItems);
  };

  const addItemsToPantry = () => {
    const selectedItems = detectedItems
      .filter(item => item.selected)
      .map(({name, brand, quantity}) => ({name, brand, quantity}));
    
    if (selectedItems.length === 0) {
      toast.error('No items selected');
      return;
    }
    
    onAddItems(selectedItems);
    toast.success(`${selectedItems.length} items added to pantry`);
    onClose();
  };

  const clearItems = () => {
    setDetectedItems([]);
    setManualInput('');
  };

  // Main options
  const options = [
    { id: 'barcode', label: 'Scan Barcode', icon: <Scan size={24} />, onClick: () => handleMethodSelect('barcode'), color: 'bg-blue-50 text-blue-600' },
    { id: 'receipt', label: 'Upload Receipt', icon: <Receipt size={24} />, onClick: () => handleMethodSelect('receipt'), color: 'bg-purple-50 text-purple-600' },
    { id: 'voice', label: 'Voice Input', icon: <Mic size={24} />, onClick: () => handleMethodSelect('voice'), color: 'bg-red-50 text-red-600' },
    { id: 'manual', label: 'Manual Entry', icon: <PenSquare size={24} />, onClick: () => handleMethodSelect('manual'), color: 'bg-amber-50 text-amber-600' },
  ];

  const renderInputMethodContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pantry-green mb-4"></div>
          <p className="text-muted-foreground">
            {inputMethod === 'barcode' && 'Scanning barcode...'}
            {inputMethod === 'receipt' && 'Processing receipt...'}
            {inputMethod === 'manual' && 'Searching...'}
          </p>
        </div>
      );
    }

    if (isRecording) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <Mic size={32} className="text-red-500" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Listening...</p>
          <p className="mt-2 text-xs text-muted-foreground">Say the items you want to add to your pantry</p>
        </div>
      );
    }

    if (detectedItems.length > 0) {
      return (
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {detectedItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center p-3 border rounded-lg bg-background"
              >
                <div className="flex-1">{item.name}</div>
                <button 
                  onClick={() => toggleItemSelection(index)}
                  className={`p-2 rounded-full transition-colors ${
                    item.selected ? 'bg-pantry-green text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {item.selected ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="outline" 
              onClick={clearItems}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} /> Clear
            </Button>
            
            <Button 
              onClick={addItemsToPantry}
              className="bg-pantry-green hover:bg-pantry-green-dark"
            >
              Add to Pantry
            </Button>
          </div>
        </div>
      );
    }

    if (inputMethod === 'manual') {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter food item name"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
            />
            <Button onClick={handleManualSearch} className="bg-pantry-green hover:bg-pantry-green-dark">
              Search
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the name of a food item and press search to find matching items
          </p>
        </div>
      );
    }

    if (inputMethod === 'barcode') {
      return (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-xs aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-muted-foreground">
            <Scan size={48} className="text-muted-foreground opacity-50" />
          </div>
          <p className="text-muted-foreground text-center">
            Position the barcode in the center of the screen
          </p>
          <Button 
            onClick={simulateBarcodeScanning} 
            className="mt-4 bg-pantry-green hover:bg-pantry-green-dark"
          >
            Simulate Scan
          </Button>
        </div>
      );
    }

    if (inputMethod === 'receipt') {
      return (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-xs aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-muted-foreground">
            <Receipt size={48} className="text-muted-foreground opacity-50" />
          </div>
          <p className="text-muted-foreground text-center">
            Upload a photo of your receipt
          </p>
          <Button 
            onClick={simulateReceiptUpload} 
            className="mt-4 bg-pantry-green hover:bg-pantry-green-dark"
          >
            Simulate Upload
          </Button>
        </div>
      );
    }

    if (inputMethod === 'voice') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Button 
            onClick={simulateVoiceRecording}
            className="w-20 h-20 rounded-full bg-pantry-green hover:bg-pantry-green-dark flex items-center justify-center mb-4"
          >
            <Mic size={36} className="text-white" />
          </Button>
          <p className="text-muted-foreground">Tap to start recording</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="blur-overlay" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-lg animate-slide-up p-6 pb-8">
        <div className="absolute left-1/2 top-3 w-12 h-1 bg-muted rounded-full -translate-x-1/2" />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {inputMethod ? 'Add to Pantry' : 'Choose Input Method'}
          </h2>
          <button 
            onClick={inputMethod ? () => setInputMethod(null) : onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {inputMethod ? <X size={20} /> : <X size={20} />}
          </button>
        </div>
        
        {inputMethod ? (
          renderInputMethodContent()
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={`p-3 mb-3 rounded-xl ${option.color}`}>
                  {option.icon}
                </div>
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AddItemOverlay;
