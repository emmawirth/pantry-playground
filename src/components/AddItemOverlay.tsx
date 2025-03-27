
import React from 'react';
import { X, Scan, Receipt, Mic, PenSquare } from 'lucide-react';

interface AddItemOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeClick: () => void;
  onReceiptClick: () => void;
  onVoiceClick: () => void;
  onManualClick: () => void;
}

const AddItemOverlay: React.FC<AddItemOverlayProps> = ({
  isOpen,
  onClose,
  onBarcodeClick,
  onReceiptClick,
  onVoiceClick,
  onManualClick,
}) => {
  if (!isOpen) return null;

  const options = [
    { id: 'barcode', label: 'Scan Barcode', icon: <Scan size={24} />, onClick: onBarcodeClick, color: 'bg-blue-50 text-blue-600' },
    { id: 'receipt', label: 'Upload Receipt', icon: <Receipt size={24} />, onClick: onReceiptClick, color: 'bg-purple-50 text-purple-600' },
    { id: 'voice', label: 'Voice Input', icon: <Mic size={24} />, onClick: onVoiceClick, color: 'bg-red-50 text-red-600' },
    { id: 'manual', label: 'Manual Entry', icon: <PenSquare size={24} />, onClick: onManualClick, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <>
      <div className="blur-overlay" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-lg animate-slide-up p-6 pb-8">
        <div className="absolute left-1/2 top-3 w-12 h-1 bg-muted rounded-full -translate-x-1/2" />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add to Pantry</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
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
      </div>
    </>
  );
};

export default AddItemOverlay;
