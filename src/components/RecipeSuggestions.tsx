
import React, { useState, useEffect } from 'react';
import { Loader2, X, ArrowLeft } from 'lucide-react';
import { getRecipeSuggestions, RecipeSuggestion } from '@/services/openai';
import Badge from './ui-components/Badge';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ApiKeyDialog } from './ApiKeyDialog';

interface RecipeSuggestionsProps {
  pantryItems: string[];
  onClose: () => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ pantryItems, onClose }) => {
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSuggestion | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setNeedsApiKey(false);
    
    try {
      console.log('Starting recipe suggestions fetch...', pantryItems);
      
      if (!pantryItems || pantryItems.length === 0) {
        throw new Error('No pantry items available to generate recipes.');
      }
      
      // Check if API key is available before attempting to fetch
      const apiKey = window.OPENAI_API_KEY || localStorage.getItem('pantrypal_openai_key') || import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        setNeedsApiKey(true);
        throw new Error('OpenAI API key is missing. Please add your API key to use recipe generation.');
      }
      
      const recipeSuggestions = await getRecipeSuggestions(pantryItems);
      console.log('Received suggestions:', recipeSuggestions);
      
      if (Array.isArray(recipeSuggestions) && recipeSuggestions.length > 0) {
        setSuggestions(recipeSuggestions);
      } else {
        throw new Error('No recipe suggestions were generated. Please try again.');
      }
    } catch (err) {
      console.error('Error in fetchSuggestions:', err);
      if (err instanceof Error) {
        setError(err.message);
        if (!err.message.includes('API key')) {
          toast.error('Recipe generation failed', {
            description: err.message
          });
        }
      } else {
        setError('Failed to generate recipe suggestions. Please try again.');
        toast.error('Recipe generation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (pantryItems && pantryItems.length > 0) {
      fetchSuggestions();
    } else {
      setError('No pantry items available to generate recipes.');
    }
  }, [pantryItems]);

  const handleSelectRecipe = (recipe: RecipeSuggestion) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  const calculatePantryItemsUsed = (ingredients: string[]) => {
    return pantryItems.filter(item => 
      ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(item.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-pantry-green mb-4" />
        <p className="text-muted-foreground">Generating creative recipes...</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (needsApiKey) {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-lg font-medium">API Key Required</h3>
        <p className="text-muted-foreground mb-6">
          To generate recipe suggestions, you need to provide your OpenAI API key.
        </p>
        <div className="flex justify-center mb-4">
          <ApiKeyDialog />
        </div>
        <Button 
          onClick={fetchSuggestions}
          className="mt-4"
        >
          Try Again
        </Button>
        <button
          onClick={onClose}
          className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchSuggestions}
          className="px-4 py-2 bg-pantry-green text-white rounded-lg hover:bg-pantry-green-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No recipe suggestions available.</p>
        <button
          onClick={fetchSuggestions}
          className="mt-4 px-4 py-2 bg-pantry-green text-white rounded-lg hover:bg-pantry-green-dark transition-colors"
        >
          Generate Suggestions
        </button>
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBackToList}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors gap-1"
          >
            <ArrowLeft size={16} />
            <span>Back to recipes</span>
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="pantry-card p-6">
            <h3 className="text-xl font-semibold mb-3">{selectedRecipe.title}</h3>
            <p className="text-muted-foreground mb-6">{selectedRecipe.description}</p>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-lg">Ingredients:</h4>
              <ul className="list-disc list-inside space-y-2 pl-2">
                {selectedRecipe.ingredients.map((ingredient, i) => {
                  const isPantryItem = pantryItems.some(item => 
                    ingredient.toLowerCase().includes(item.toLowerCase())
                  );
                  return (
                    <li key={i} className={`text-base ${isPantryItem ? 'font-medium text-pantry-green' : ''}`}>
                      {ingredient}
                      {isPantryItem && ' (in your pantry)'}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3 text-lg">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-4 pl-2">
                {selectedRecipe.instructions.map((instruction, i) => (
                  <li key={i} className="text-base pb-2 border-b border-gray-100 last:border-0">{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge label={selectedRecipe.difficulty} variant="level" />
                {selectedRecipe.dietaryLabels.map((label, i) => (
                  <Badge key={i} label={label} variant="dietary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{selectedRecipe.cookingTime}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recipe Suggestions</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-muted-foreground">
        Here are some recipes you can make with your selected ingredients.
        Click on a recipe to see detailed instructions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((recipe, index) => {
          const pantryItemsUsed = calculatePantryItemsUsed(recipe.ingredients);
          const totalIngredients = recipe.ingredients.length;
          const additionalIngredientsNeeded = totalIngredients - pantryItemsUsed.length;
          
          return (
            <div 
              key={index} 
              className="pantry-card p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleSelectRecipe(recipe)}
            >
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{recipe.description}</p>
              
              <div className="mb-3 space-y-2">
                <div className="flex items-center">
                  <span className="text-xs bg-pantry-green/10 text-pantry-green font-medium px-2 py-1 rounded-full">
                    Uses {pantryItemsUsed.length} of your pantry items
                  </span>
                </div>
                
                {additionalIngredientsNeeded > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded-full">
                      Needs {additionalIngredientsNeeded} additional ingredient{additionalIngredientsNeeded !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge label={recipe.difficulty} variant="level" />
                </div>
                <span className="text-sm text-muted-foreground">{recipe.cookingTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeSuggestions;
