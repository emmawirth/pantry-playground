
import OpenAI from 'openai';
import { toast } from 'sonner';

// Initialize OpenAI client with error handling
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Create a default mock response for when API key is missing
const mockRecipes = [
  {
    title: "Chicken Stir-Fry",
    description: "A quick and easy stir-fry using chicken and vegetables from your pantry.",
    ingredients: [
      "2 chicken breasts, sliced",
      "1 cup mixed vegetables",
      "2 tbsp soy sauce",
      "1 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "1 bell pepper, sliced",
      "1 cup mushrooms, sliced"
    ],
    instructions: [
      "Heat oil in a large pan over medium-high heat.",
      "Add chicken and cook until browned, about 5 minutes.",
      "Add garlic and ginger, cook for 1 minute until fragrant.",
      "Add vegetables and stir-fry for 3-4 minutes until tender-crisp.",
      "Add soy sauce and stir to combine.",
      "Serve hot over rice if desired."
    ],
    cookingTime: "25 minutes",
    difficulty: "Beginner" as const,
    dietaryLabels: ["High Protein"]
  },
  {
    title: "Vegetable Fried Rice",
    description: "A flavorful vegetarian fried rice using pantry staples.",
    ingredients: [
      "2 cups cooked rice",
      "1 cup mixed vegetables",
      "2 eggs, beaten",
      "2 tbsp soy sauce",
      "1 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 onion, diced",
      "1 tbsp ginger, grated"
    ],
    instructions: [
      "Heat oil in a large pan or wok over medium-high heat.",
      "Add onion, garlic, and ginger, cook until fragrant.",
      "Add vegetables and stir-fry for 3-4 minutes.",
      "Push ingredients to one side, add beaten eggs to empty space.",
      "Scramble eggs, then mix with vegetables.",
      "Add cooked rice and soy sauce, stir to combine.",
      "Cook for 3-4 minutes until everything is heated through."
    ],
    cookingTime: "20 minutes",
    difficulty: "Beginner" as const,
    dietaryLabels: ["Vegetarian"]
  },
  {
    title: "Garlic Mushroom Pasta",
    description: "A simple yet delicious pasta dish featuring garlic and mushrooms.",
    ingredients: [
      "8 oz pasta",
      "2 cups mushrooms, sliced",
      "4 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tbsp butter",
      "Salt and pepper to taste",
      "Fresh herbs (optional)"
    ],
    instructions: [
      "Cook pasta according to package instructions.",
      "While pasta cooks, heat oil and butter in a large pan.",
      "Add garlic and cook for 1 minute until fragrant.",
      "Add mushrooms and cook until browned and tender, about 5-7 minutes.",
      "Season with salt and pepper.",
      "Drain pasta and add to the pan with mushrooms.",
      "Toss to combine and serve hot with fresh herbs if desired."
    ],
    cookingTime: "15 minutes",
    difficulty: "Beginner" as const,
    dietaryLabels: ["Vegetarian"]
  }
];

let openai: OpenAI | null = null;

if (apiKey) {
  try {
    openai = new OpenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    toast.error('API initialization failed', { 
      description: 'Please check your OpenAI API key configuration.' 
    });
  }
}

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
    // If OpenAI is not initialized or API key is missing, return mock data
    if (!openai || !apiKey) {
      console.warn('Using mock recipe data because OpenAI API key is not configured');
      toast.warning('Using demo recipe data', { 
        description: 'Add your OpenAI API key in .env file to get custom recipes.' 
      });
      return mockRecipes as RecipeSuggestion[];
    }

    console.log('Generating recipe suggestions for items:', pantryItems);
    
    const prompt = `Given these pantry items: ${pantryItems.join(', ')}, suggest 3 creative recipes. 
    For each recipe, provide:
    1. A creative title
    2. A brief description
    3. List of ingredients (including quantities)
    4. Step-by-step instructions
    5. Estimated cooking time
    6. Difficulty level (must be exactly one of these values: "Beginner", "Intermediate", or "Advanced")
    7. Dietary labels (e.g., Vegetarian, Vegan, Gluten-Free, etc.)
    
    Format the response as a JSON array with these fields: title, description, ingredients, instructions, cookingTime, difficulty, dietaryLabels`;

    console.log('Sending request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Fallback to a more widely available model
      messages: [
        {
          role: "system",
          content: "You are a creative chef who specializes in making delicious recipes from available ingredients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    console.log('Received response from OpenAI');
    
    if (!completion.choices[0].message.content) {
      throw new Error('Empty response from OpenAI');
    }
    
    const responseContent = completion.choices[0].message.content;
    const response = JSON.parse(responseContent);
    
    if (!response.recipes || !Array.isArray(response.recipes) || response.recipes.length === 0) {
      console.warn('Invalid recipe format from API, using fallback');
      return mockRecipes as RecipeSuggestion[];
    }
    
    // Ensure the difficulty property conforms to the RecipeSuggestion type
    const processedRecipes = response.recipes.map((recipe: any) => {
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
    
    // Return mock data as fallback
    console.warn('Falling back to mock recipe data after error');
    return mockRecipes as RecipeSuggestion[];
  }
}
