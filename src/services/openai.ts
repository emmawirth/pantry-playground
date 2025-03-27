import OpenAI from 'openai';

// Initialize OpenAI client with error handling
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.error('OpenAI API key is not set. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey,
});

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
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Generating recipe suggestions for items:', pantryItems);
    
    const prompt = `Given these pantry items: ${pantryItems.join(', ')}, suggest 3 creative recipes. 
    For each recipe, provide:
    1. A creative title
    2. A brief description
    3. List of ingredients (including quantities)
    4. Step-by-step instructions
    5. Estimated cooking time
    6. Difficulty level (Beginner/Intermediate/Advanced)
    7. Dietary labels (e.g., Vegetarian, Vegan, Gluten-Free, etc.)
    
    Format the response as a JSON array with these fields: title, description, ingredients, instructions, cookingTime, difficulty, dietaryLabels`;

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
    const response = JSON.parse(completion.choices[0].message.content || '{"recipes": []}');
    return response.recipes;
  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate recipes: ${error.message}`);
    }
    throw error;
  }
} 