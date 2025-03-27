
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface RecipeSuggestion {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dietaryLabels: string[];
}

export async function getRecipeSuggestions(pantryItems: string[]): Promise<RecipeSuggestion[]> {
  try {
    console.log('Generating recipe suggestions for items:', pantryItems);
    
    if (!pantryItems || pantryItems.length === 0) {
      throw new Error('No pantry items available to generate recipes.');
    }
    
    const { data, error } = await supabase.functions.invoke('generate-recipes', {
      body: { pantryItems }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to generate recipes: ${error.message}`);
    }
    
    console.log('Received data from Edge Function:', data);
    
    if (!data || !data.recipes || !Array.isArray(data.recipes) || data.recipes.length === 0) {
      if (data && data.error) {
        console.warn('Edge function returned error:', data.error);
      }
      console.warn('Invalid recipe format from API, using fallback');
      
      if (data && data.error) {
        toast.warning('Using demo recipe data', { 
          description: data.error 
        });
      }
      
      if (data && data.recipes) {
        return data.recipes as RecipeSuggestion[];
      } else {
        throw new Error('No recipes returned from the API');
      }
    }
    
    // Ensure the difficulty property conforms to the RecipeSuggestion type
    const processedRecipes = data.recipes.map((recipe: any) => {
      // Ensure difficulty is one of the accepted values
      let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
      
      if (recipe.difficulty === 'Intermediate' || recipe.difficulty === 'Advanced') {
        difficulty = recipe.difficulty;
      }
      
      return {
        ...recipe,
        difficulty
      };
    });
    
    return processedRecipes as RecipeSuggestion[];
  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    
    // Handle API errors gracefully
    if (error instanceof Error) {
      toast.error('Recipe generation failed', { 
        description: error.message 
      });
    }
    
    // Return empty array as fallback
    return [];
  }
}
