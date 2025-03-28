
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'pantrypal_openai_key';

export function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem(STORAGE_KEY);
    setHasStoredKey(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
      // Also set in window for immediate use
      window.OPENAI_API_KEY = storedKey;
    }
  }, []);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, apiKey);
    setHasStoredKey(true);
    setOpen(false);
    
    // Set key in window for immediate use without reload
    window.OPENAI_API_KEY = apiKey;
    
    toast.success('API key saved successfully', {
      description: 'Your API key has been saved for this session.'
    });
  };

  const removeApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setHasStoredKey(false);
    window.OPENAI_API_KEY = undefined;
    toast.info('API key removed');
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <KeyRound size={16} />
        {hasStoredKey ? 'Update API Key' : 'Add API Key'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>OpenAI API Key</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to enable AI-powered recipe suggestions.
              Your key will be stored locally on your device.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Your key is stored only in your browser's local storage and is never sent to our servers.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            {hasStoredKey && (
              <Button variant="destructive" onClick={removeApiKey}>
                Remove Key
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveApiKey}>Save Key</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
