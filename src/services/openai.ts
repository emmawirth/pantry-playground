
import OpenAI from 'openai';
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

// Storage key for the OpenAI API key (matching the one in ApiKeyDialog.tsx)
const STORAGE_KEY = 'pantrypal_openai_key';

// Initialize OpenAI client with key from various sources
const getOpenAIClient = () => {
  // Try to get API key from window global variable (set by ApiKeyDialog)
  let apiKey = window.OPENAI_API_KEY;
  
  // If not available, try localStorage
  if (!apiKey) {
    apiKey = localStorage.getItem(STORAGE_KEY);
  }
  
  // If still not available, try environment variable (backup)
  if (!apiKey) {
    apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }
  
  // Create and return a new OpenAI client
  return new OpenAI({
    apiKey: apiKey || 'dummy-key', // Using dummy key to prevent instantiation error
    dangerouslyAllowBrowser: true // Allow usage in browser environment
  });
};

// Mock recipes to use as fallback
const mockRecipes: RecipeSuggestion[] = [
  {
    title: "Berry Breakfast Parfait",
    description: "A delicious and nutritious layered breakfast parfait with fresh berries, yogurt, and granola.",
    ingredients: [
      "2 cups Greek yogurt",
      "1 cup mixed berries (strawberries, blueberries, raspberries)",
      "1/2 cup granola",
      "2 tbsp honey or maple syrup",
      "1 tbsp chia seeds",
      "Fresh mint leaves for garnish (optional)"
    ],
    instructions: [
      "In two serving glasses, create alternating layers starting with yogurt.",
      "Add a layer of mixed berries.",
      "Sprinkle some granola on top.",
      "Repeat the layers until the glasses are filled.",
      "Drizzle with honey or maple syrup.",
      "Top with chia seeds and a few extra berries.",
      "Garnish with fresh mint if desired.",
      "Serve immediately or refrigerate for up to 4 hours."
    ],
    cookingTime: "10 minutes",
    difficulty: "Beginner" as const,
    dietaryLabels: ["Vegetarian", "Low Fat"]
  },
  {
    title: "Mediterranean Chickpea Bowl",
    description: "A flavorful Mediterranean bowl using chickpeas and fresh vegetables for a nutritious meal.",
    ingredients: [
      "2 cans chickpeas, drained and rinsed",
      "1 cucumber, diced",
      "1 pint cherry tomatoes, halved",
      "1 red onion, thinly sliced",
      "1/2 cup kalamata olives, pitted",
      "1/4 cup fresh parsley, chopped",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "1 tsp dried oregano",
      "1/2 tsp cumin",
      "Salt and pepper to taste",
      "Optional: crumbled feta cheese"
    ],
    instructions: [
      "In a large bowl, combine chickpeas, cucumber, tomatoes, red onion, and olives.",
      "In a small bowl, whisk together olive oil, lemon juice, oregano, cumin, salt, and pepper.",
      "Pour the dressing over the chickpea mixture and toss to combine.",
      "Fold in the chopped parsley.",
      "Let sit for at least 10 minutes to allow flavors to meld.",
      "Serve in bowls and top with crumbled feta cheese if desired.",
      "This dish can be served at room temperature or chilled."
    ],
    cookingTime: "25 minutes",
    difficulty: "Intermediate" as const,
    dietaryLabels: ["Vegan", "High Fiber"]
  },
  {
    title: "Sheet Pan Honey Mustard Chicken",
    description: "A simple yet delicious sheet pan dinner with honey mustard glazed chicken and roasted vegetables.",
    ingredients: [
      "6 chicken thighs, bone-in, skin-on",
      "1 lb baby potatoes, halved",
      "2 cups Brussels sprouts, trimmed and halved",
      "2 large carrots, cut into 1-inch pieces",
      "3 tbsp olive oil, divided",
      "3 tbsp honey",
      "2 tbsp Dijon mustard",
      "2 cloves garlic, minced",
      "1 tbsp fresh rosemary, chopped",
      "1 lemon, juiced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "In a small bowl, mix 2 tbsp olive oil, honey, Dijon mustard, garlic, rosemary, and lemon juice.",
      "Place chicken thighs in a large bowl and pour half of the honey-mustard sauce over them. Toss to coat.",
      "In another bowl, toss potatoes, Brussels sprouts, and carrots with remaining 1 tbsp olive oil, salt, and pepper.",
      "Arrange vegetables on a large baking sheet, leaving space for the chicken.",
      "Place chicken thighs on the baking sheet, skin-side up.",
      "Roast for 35-40 minutes, until chicken is golden and cooked through (internal temperature of 165°F).",
      "Drizzle remaining sauce over the chicken and vegetables before serving.",
      "Garnish with additional fresh herbs if desired."
    ],
    cookingTime: "40 minutes",
    difficulty: "Beginner" as const,
    dietaryLabels: ["High Protein", "Low Carb"]
  }
];

export async function getRecipeSuggestions(pantryItems: string[]): Promise<RecipeSuggestion[]> {
  try {
    console.log('Generating recipe suggestions for items:', pantryItems);
    
    if (!pantryItems || pantryItems.length === 0) {
      throw new Error('No pantry items available to generate recipes.');
    }
    
    // Check if we have a valid API key before proceeding
    const apiKey = window.OPENAI_API_KEY || localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is missing. Please add your API key in settings.');
    }
    
    const openai = getOpenAIClient();
    
    const prompt = `Given these available pantry items: ${pantryItems.join(', ')}, suggest 3 creative recipes. 
    The recipes MUST use at least 2 of the provided pantry items, but can also suggest additional ingredients that might not be in the list.
    Prioritize recipes that use MORE of the provided pantry items, but feel free to suggest common additional ingredients to complete the recipe.
    
    For each recipe, provide:
    1. A creative title
    2. A brief description that mentions which pantry items are used
    3. List of ingredients (including quantities), clearly marking which ones come from the pantry list
    4. Step-by-step instructions
    5. Estimated cooking time
    6. Difficulty level (must be exactly one of these values: "Beginner", "Intermediate", or "Advanced")
    7. Dietary labels (e.g., Vegetarian, Vegan, Gluten-Free, etc.)
    
    Format the response as a JSON object with a "recipes" array containing these fields: title, description, ingredients, instructions, cookingTime, difficulty, dietaryLabels`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative chef who specializes in making delicious recipes from available ingredients. You're excellent at suggesting recipes that use what people already have, while minimizing additional ingredients they might need to buy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      console.log('Empty response from OpenAI');
      throw new Error('Empty response from OpenAI');
    }
    
    const response = JSON.parse(responseContent);
    
    if (!response.recipes || !Array.isArray(response.recipes) || response.recipes.length === 0) {
      console.warn('Invalid recipe format from API, using fallback');
      return mockRecipes;
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
    
    // Return mock recipes as fallback
    return mockRecipes;
  }
}
