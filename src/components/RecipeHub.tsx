import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Clock, Heart } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Badge from './ui-components/Badge';

// Recipe data with realistic food images
const recipesData = [
  {
    id: '1',
    title: 'Avocado & Egg Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 15,
    ingredientsAvailable: 80,
    dietaryLabels: ['Vegetarian', 'High Protein'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 eggs',
      '1 tbsp olive oil',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Fresh herbs (optional)'
    ],
    instructions: [
      'Toast the bread until golden and crispy.',
      'While bread is toasting, heat olive oil in a non-stick pan over medium heat.',
      'Crack eggs into the pan and cook to your preference (sunny-side up, over easy, etc.).',
      'Cut the avocado in half, remove the pit, and scoop out the flesh into a bowl.',
      'Mash the avocado with a fork and season with salt and pepper.',
      'Spread the mashed avocado evenly on the toasted bread.',
      'Top each slice with a cooked egg.',
      'Garnish with red pepper flakes and fresh herbs if desired.',
      'Serve immediately and enjoy!'
    ]
  },
  {
    id: '2',
    title: 'Berry Breakfast Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 10,
    ingredientsAvailable: 100,
    dietaryLabels: ['Vegetarian', 'Low Fat'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '2 cups Greek yogurt',
      '1 cup mixed berries (strawberries, blueberries, raspberries)',
      '1/2 cup granola',
      '2 tbsp honey or maple syrup',
      '1 tbsp chia seeds',
      'Fresh mint leaves for garnish (optional)'
    ],
    instructions: [
      'In two serving glasses, create alternating layers starting with yogurt.',
      'Add a layer of mixed berries.',
      'Sprinkle some granola on top.',
      'Repeat the layers until the glasses are filled.',
      'Drizzle with honey or maple syrup.',
      'Top with chia seeds and a few extra berries.',
      'Garnish with fresh mint if desired.',
      'Serve immediately or refrigerate for up to 4 hours.'
    ]
  },
  {
    id: '3',
    title: 'Mediterranean Chickpea Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 25,
    ingredientsAvailable: 60,
    dietaryLabels: ['Vegan', 'High Fiber'],
    cookingLevel: 'Intermediate' as const,
    ingredients: [
      '2 cans chickpeas, drained and rinsed',
      '1 cucumber, diced',
      '1 pint cherry tomatoes, halved',
      '1 red onion, thinly sliced',
      '1/2 cup kalamata olives, pitted',
      '1/4 cup fresh parsley, chopped',
      '1/4 cup olive oil',
      '2 tbsp lemon juice',
      '1 tsp dried oregano',
      '1/2 tsp cumin',
      'Salt and pepper to taste',
      'Optional: crumbled feta cheese'
    ],
    instructions: [
      'In a large bowl, combine chickpeas, cucumber, tomatoes, red onion, and olives.',
      'In a small bowl, whisk together olive oil, lemon juice, oregano, cumin, salt, and pepper.',
      'Pour the dressing over the chickpea mixture and toss to combine.',
      'Fold in the chopped parsley.',
      'Let sit for at least 10 minutes to allow flavors to meld.',
      'Serve in bowls and top with crumbled feta cheese if desired.',
      'This dish can be served at room temperature or chilled.'
    ]
  },
  {
    id: '4',
    title: 'Lemon Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 25,
    ingredientsAvailable: 70,
    dietaryLabels: ['Keto', 'High Protein'],
    cookingLevel: 'Intermediate' as const,
    ingredients: [
      '4 salmon fillets (about 6 oz each)',
      '3 tbsp olive oil',
      '3 cloves garlic, minced',
      '1 lemon, zested and juiced',
      '2 tbsp fresh dill, chopped',
      'Salt and pepper to taste',
      '1 tbsp butter'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, mix olive oil, minced garlic, lemon zest, lemon juice, and dill.',
      'Place salmon fillets on a baking sheet lined with parchment paper.',
      'Season with salt and pepper.',
      'Pour the lemon-garlic mixture over the salmon fillets.',
      'Top each fillet with a small piece of butter.',
      'Bake for 15-18 minutes, until salmon is opaque and flakes easily with a fork.',
      'Garnish with additional fresh dill and lemon slices if desired.',
      'Serve immediately with your favorite side dishes and enjoy!'
    ]
  },
  {
    id: '5',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 20,
    ingredientsAvailable: 90,
    dietaryLabels: ['Vegan', 'Low Calorie'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '2 cups mixed vegetables (bell peppers, broccoli, carrots, snap peas)',
      '1 block tofu, cubed and pressed',
      '2 tbsp vegetable oil',
      '3 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '3 tbsp soy sauce',
      '1 tbsp sesame oil',
      '1 tbsp rice vinegar',
      '1 tsp brown sugar',
      'Red pepper flakes to taste',
      'Sesame seeds for garnish'
    ],
    instructions: [
      'In a small bowl, whisk together soy sauce, sesame oil, rice vinegar, and brown sugar. Set aside.',
      'Heat vegetable oil in a large wok or skillet over high heat.',
      'Add tofu and cook until golden brown on all sides, about 5 minutes. Remove and set aside.',
      'Add garlic and ginger to the pan and stir for 30 seconds until fragrant.',
      'Add vegetables and stir-fry for 4-5 minutes until crisp-tender.',
      'Return tofu to the pan and pour sauce over everything.',
      'Stir to coat and cook for another 1-2 minutes.',
      'Sprinkle with red pepper flakes and sesame seeds.',
      'Serve hot over rice or noodles and enjoy!'
    ]
  },
  {
    id: '6',
    title: 'Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 15,
    ingredientsAvailable: 75,
    dietaryLabels: ['Gluten-Free', 'Vegan'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '1 cup quinoa, rinsed',
      '2 cups water or vegetable broth',
      '1 cucumber, diced',
      '1 bell pepper, diced',
      '1/4 red onion, finely diced',
      '1/2 cup cherry tomatoes, halved',
      '1/4 cup fresh herbs (parsley, mint, or cilantro), chopped',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      '1 tsp honey or maple syrup',
      'Salt and pepper to taste',
      'Optional: crumbled feta cheese, olives, avocado'
    ],
    instructions: [
      'Bring water or broth to a boil in a medium saucepan.',
      'Add quinoa, reduce heat to low, cover and simmer for 15 minutes.',
      'Remove from heat and let stand, covered, for 5 minutes.',
      'Fluff with a fork and transfer to a large bowl to cool.',
      'In a small bowl, whisk together olive oil, lemon juice, honey, salt, and pepper.',
      'Add diced vegetables and herbs to the cooled quinoa.',
      'Pour dressing over the salad and toss to combine.',
      'Add optional toppings if desired.',
      'Serve chilled or at room temperature and enjoy!'
    ]
  },
  {
    id: '7',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 35,
    ingredientsAvailable: 85,
    dietaryLabels: ['Vegetarian', 'Gluten-Free'],
    cookingLevel: 'Intermediate' as const,
    ingredients: [
      '1 1/2 cups Arborio rice',
      '4 cups vegetable broth, warmed',
      '1/2 cup dry white wine',
      '8 oz mushrooms, sliced',
      '1 small onion, finely diced',
      '2 cloves garlic, minced',
      '3 tbsp butter, divided',
      '2 tbsp olive oil',
      '1/2 cup grated Parmesan cheese',
      '2 tbsp fresh thyme leaves',
      'Salt and pepper to taste'
    ],
    instructions: [
      'In a large skillet, heat 1 tbsp butter and olive oil over medium heat.',
      'Add mushrooms and cook until browned, about 5 minutes. Remove and set aside.',
      'In the same pan, add 1 tbsp butter, onion, and garlic. Cook until soft, about 3 minutes.',
      'Add Arborio rice and stir to coat in butter and oil, cooking for 1-2 minutes.',
      'Pour in wine and stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly and waiting until liquid is absorbed before adding more.',
      'Continue until rice is creamy and al dente, about 20-25 minutes.',
      'Stir in cooked mushrooms, remaining butter, Parmesan cheese, and thyme.',
      'Season with salt and pepper to taste.',
      'Serve immediately and enjoy!'
    ]
  },
  {
    id: '8',
    title: 'Sheet Pan Honey Mustard Chicken',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 40,
    ingredientsAvailable: 80,
    dietaryLabels: ['High Protein', 'Low Carb'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '6 chicken thighs, bone-in, skin-on',
      '1 lb baby potatoes, halved',
      '2 cups Brussels sprouts, trimmed and halved',
      '2 large carrots, cut into 1-inch pieces',
      '3 tbsp olive oil, divided',
      '3 tbsp honey',
      '2 tbsp Dijon mustard',
      '2 cloves garlic, minced',
      '1 tbsp fresh rosemary, chopped',
      '1 lemon, juiced',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'In a small bowl, mix 2 tbsp olive oil, honey, Dijon mustard, garlic, rosemary, and lemon juice.',
      'Place chicken thighs in a large bowl and pour half of the honey-mustard sauce over them. Toss to coat.',
      'In another bowl, toss potatoes, Brussels sprouts, and carrots with remaining 1 tbsp olive oil, salt, and pepper.',
      'Arrange vegetables on a large baking sheet, leaving space for the chicken.',
      'Place chicken thighs on the baking sheet, skin-side up.',
      'Roast for 35-40 minutes, until chicken is golden and cooked through (internal temperature of 165°F).',
      'Drizzle remaining sauce over the chicken and vegetables before serving.',
      'Garnish with additional fresh herbs if desired.'
    ]
  },
  {
    id: '9',
    title: 'Mediterranean Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 30,
    ingredientsAvailable: 70,
    dietaryLabels: ['Vegetarian', 'Mediterranean'],
    cookingLevel: 'Intermediate' as const,
    ingredients: [
      '12 oz pasta (penne or fusilli)',
      '1 cup cherry tomatoes, halved',
      '1/2 cup Kalamata olives, pitted and halved',
      '1 bell pepper, diced',
      '1/2 red onion, thinly sliced',
      '1/2 cup feta cheese, crumbled',
      '1/4 cup fresh basil, chopped',
      '3 tbsp olive oil',
      '2 tbsp red wine vinegar',
      '2 cloves garlic, minced',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook pasta according to package directions. Drain and let cool slightly.',
      'In a large bowl, combine tomatoes, olives, bell pepper, red onion, and basil.',
      'In a small bowl, whisk together olive oil, red wine vinegar, garlic, oregano, salt, and pepper.',
      'Add pasta to the vegetable mixture.',
      'Pour dressing over pasta and vegetables, tossing to coat.',
      'Sprinkle with crumbled feta cheese.',
      'Serve warm or at room temperature and enjoy!'
    ]
  },
  {
    id: '10',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 5,
    ingredientsAvailable: 100,
    dietaryLabels: ['High Protein', 'Low Sugar'],
    cookingLevel: 'Beginner' as const,
    ingredients: [
      '1 cup mixed berries (strawberries, blueberries, raspberries)',
      '1 scoop protein powder (vanilla or unflavored)',
      '1 cup almond milk or milk of choice',
      '1/2 banana',
      '1 tbsp nut butter',
      '1 tsp honey or maple syrup (optional)',
      'Ice cubes as needed'
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth, adding more liquid if needed.',
      'Pour into a glass and enjoy immediately!'
    ]
  }
];

interface RecipeHubProps {
  favoriteRecipes: string[];
  onToggleFavorite: (recipeId: string) => void;
  pantryItems?: string[];
}

const RecipeHub: React.FC<RecipeHubProps> = ({ favoriteRecipes, onToggleFavorite, pantryItems = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof recipesData)[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleRecipeClick = (recipe: (typeof recipesData)[0]) => {
    setSelectedRecipe(recipe);
  };

  const toggleFavorite = (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleFavorite(recipeId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter recipes based on search query
  const filteredRecipes = recipesData.filter(recipe => {
    if (!searchQuery) return true;
    
    // Check if recipe title matches search
    if (recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) return true;
    
    // Check if any ingredient matches search
    const ingredientMatch = recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return ingredientMatch;
  });

  return (
    <div className="pb-24">
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-6">Recipe Hub</h1>
        
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-14 py-3 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pantry-green/30 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-pantry-green text-white p-1 rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
            </button>
          </div>
          
          {searchQuery && (
            <div className="mt-2 text-sm text-muted-foreground">
              Showing {filteredRecipes.length} recipes with "{searchQuery}"
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative">
              <RecipeCard 
                {...recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
              <button
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  favoriteRecipes.includes(recipe.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600'
                }`}
                onClick={(e) => toggleFavorite(recipe.id, e)}
              >
                <Heart size={16} fill={favoriteRecipes.includes(recipe.id) ? "white" : "none"} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedRecipe.title}</span>
                  <button
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      favoriteRecipes.includes(selectedRecipe.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                  >
                    <Heart size={16} fill={favoriteRecipes.includes(selectedRecipe.id) ? "white" : "none"} />
                  </button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={14} className="mr-1" />
                    <span>{selectedRecipe.cookTime} mins</span>
                  </div>
                  <Badge label={selectedRecipe.cookingLevel} variant="level" />
                  {selectedRecipe.dietaryLabels.map((label, i) => (
                    <Badge key={i} label={label} variant="dietary" />
                  ))}
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRecipe.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-sm">{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, i) => (
                      <li key={i} className="bg-gray-50 p-3 rounded-lg border-l-4 border-pantry-green">
                        <span className="font-medium block text-pantry-green mb-1">Step {i+1}</span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeHub;
