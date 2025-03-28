
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OpenAI')
})

// Mock recipes to use as fallback
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
    difficulty: "Beginner",
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
    difficulty: "Beginner",
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
    difficulty: "Beginner",
    dietaryLabels: ["Vegetarian"]
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    console.log('Processing recipe generation request')
    const { pantryItems } = await req.json()
    
    if (!pantryItems || !Array.isArray(pantryItems) || pantryItems.length === 0) {
      console.log('Invalid or empty pantry items')
      return new Response(
        JSON.stringify({ 
          recipes: mockRecipes, 
          error: 'No pantry items provided, using mock recipes' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log(`Generating recipe suggestions for items: ${pantryItems.join(', ')}`)
    
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
      console.log('Empty response from OpenAI')
      throw new Error('Empty response from OpenAI')
    }
    
    const response = JSON.parse(responseContent);
    
    console.log('Successfully generated recipes')
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error generating recipes:', error)
    
    return new Response(
      JSON.stringify({ 
        recipes: mockRecipes, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
