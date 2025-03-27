import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getRecipeSuggestions, RecipeSuggestion } from '@/services/openai';
import Badge from './ui-components/Badge';

interface RecipeSuggestionsProps {
  pantryItems: string[];
  onClose: () => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ pantryItems, onClose }) => {
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting recipe suggestions fetch...');
      const recipeSuggestions = await getRecipeSuggestions(pantryItems);
      console.log('Received suggestions:', recipeSuggestions);
      setSuggestions(recipeSuggestions);
    } catch (err) {
      console.error('Error in fetchSuggestions:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate recipe suggestions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (pantryItems.length > 0) {
      fetchSuggestions();
    } else {
      setError('No pantry items available to generate recipes.');
    }
  }, [pantryItems]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-pantry-green mb-4" />
        <p className="text-muted-foreground">Generating creative recipes...</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Recipe Suggestions</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        {suggestions.map((recipe, index) => (
          <div key={index} className="pantry-card p-4">
            <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
            <p className="text-muted-foreground mb-4">{recipe.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-sm">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1">
                {recipe.instructions.map((instruction, i) => (
                  <li key={i} className="text-sm">{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge label={recipe.difficulty} variant="level" />
                {recipe.dietaryLabels.map((label, i) => (
                  <Badge key={i} label={label} variant="dietary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{recipe.cookingTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSuggestions; 