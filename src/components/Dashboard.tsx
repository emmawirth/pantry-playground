import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Sparkles, Heart, Clock, User } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeSuggestions from './RecipeSuggestions';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { FilterOptions } from '@/pages/Index';
import { toast } from 'sonner';
import Badge from './ui-components/Badge';

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

interface DashboardProps {
  favoriteRecipes: string[];
  onToggleFavorite: (recipeId: string) => void;
  filterOptions: FilterOptions;
  onUpdateFilterOptions: (options: FilterOptions) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  favoriteRecipes, 
  onToggleFavorite,
  filterOptions,
  onUpdateFilterOptions
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof recipesData)[0] | null>(null);
  
  const [pantryItems] = useState([
    'Chicken breast',
    'Rice',
    'Onions',
    'Garlic',
    'Olive oil',
    'Mixed vegetables',
    'Soy sauce',
    'Ginger',
    'Bell peppers',
    'Mushrooms'
  ]);
  
  const handleRecipeClick = (id: string) => {
    console.log(`Recipe clicked: ${id}`);
    const recipe = recipesData.find(r => r.id === id);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  const toggleFavorite = (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleFavorite(recipeId);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onUpdateFilterOptions({
      ...filterOptions,
      [key]: value
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    const matchedRecipes = recipesData.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.dietaryLabels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (matchedRecipes.length > 0) {
      toast.success(`Found ${matchedRecipes.length} recipes matching "${searchQuery}"`);
    } else {
      toast.info(`No recipes found for "${searchQuery}". Try different keywords.`);
    }
  };

  const firstName = user?.user_metadata?.first_name || 'Chef';

  const filteredRecipes = recipesData.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = !filterOptions.skill || recipe.cookingLevel === filterOptions.skill;
    
    let matchesTime = true;
    if (filterOptions.time) {
      const [min, max] = filterOptions.time.split('-').map(Number);
      if (max) {
        matchesTime = recipe.cookTime >= min && recipe.cookTime <= max;
      } else {
        matchesTime = recipe.cookTime >= 60;
      }
    }
    
    const matchesDiet = !filterOptions.diet || 
                        filterOptions.diet === 'No preference' || 
                        recipe.dietaryLabels.includes(filterOptions.diet);
    
    return matchesSearch && matchesSkill && matchesTime && matchesDiet;
  });

  return (
    <div className="pb-24">
      <div className="relative bg-pantry-green pt-12 pb-8 px-4 rounded-b-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80')] bg-cover opacity-10" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-pantry-green-light">Welcome back! 🌱</span>
              <h1 className="text-white text-2xl font-semibold mt-1">{firstName}</h1>
            </div>
            <Dialog>
              <DialogTrigger>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <div className="space-y-4 py-2">
                  <h3 className="text-lg font-semibold">User Profile</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="pt-4">
                    <button
                      onClick={() => signOut()}
                      className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {showFilters && (
            <div className="mb-3 p-4 bg-white rounded-xl shadow-lg">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Cooking skill level</p>
                  <div className="flex space-x-2">
                    {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleFilterChange('skill', level as any)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          filterOptions.skill === level
                            ? 'bg-pantry-green text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Cooking Time</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: '0-20', label: '0-20 mins' },
                      { id: '20-40', label: '20-40 mins' },
                      { id: '40-60', label: '40-60 mins' },
                      { id: '60+', label: '60+ mins' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange('time', option.id as any)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          filterOptions.time === option.id
                            ? 'bg-pantry-green text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Dietary Labels</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'No preference',
                      'Vegan',
                      'Vegetarian',
                      'Gluten-Free',
                      'Keto',
                      'Paleo',
                    ].map((diet) => (
                      <button
                        key={diet}
                        onClick={() => handleFilterChange('diet', diet)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          filterOptions.diet === diet
                            ? 'bg-pantry-green text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input 
                type="text"
                placeholder="Search recipes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <button type="submit" className="hidden">Search</button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Smart Picks</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSuggestions(true)}
              className="text-sm text-pantry-green flex items-center hover:text-pantry-green-dark transition-colors"
            >
              <Sparkles size={16} className="mr-1" />
              AI Suggestions
            </button>
            <button className="text-sm text-muted-foreground flex items-center">
              See all <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4">
          {recipesData.slice(0, 5).map((recipe) => (
            <div className="w-60 flex-shrink-0 relative" key={recipe.id}>
              <RecipeCard 
                {...recipe}
                onClick={() => handleRecipeClick(recipe.id)}
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
      
      <div className="px-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Pantry</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Items', value: '24', color: 'bg-pantry-green/10 text-pantry-green' },
            { label: 'Expiring Soon', value: '6', color: 'bg-amber-50 text-amber-600' },
            { label: 'Recently Used', value: '12', color: 'bg-pantry-green/10 text-pantry-green' },
          ].map((item, index) => (
            <div 
              key={index}
              className="pantry-card flex flex-col items-center justify-center p-4"
            >
              <div className={`text-lg font-bold ${item.color} w-10 h-10 rounded-full flex items-center justify-center mb-2`}>
                {item.value}
              </div>
              <span className="text-xs text-muted-foreground text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Explore Recipes</h2>
          <button className="text-sm text-muted-foreground flex items-center">
            See all <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredRecipes.slice(0, 6).map((recipe) => (
            <div key={recipe.id} className="relative">
              <RecipeCard 
                {...recipe}
                onClick={() => handleRecipeClick(recipe.id)}
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

      {showSuggestions && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <RecipeSuggestions 
                pantryItems={pantryItems}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
          </div>
        </div>
      )}

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
                    {selectedRecipe.ingredients?.map((ingredient, i) => (
                      <li key={i} className="text-sm">{ingredient}</li>
                    )) || <li className="text-sm text-muted-foreground">No ingredients available</li>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions?.map((instruction, i) => (
                      <li key={i} className="bg-gray-50 p-3 rounded-lg border-l-4 border-pantry-green">
                        <span className="font-medium block text-pantry-green mb-1">Step {i+1}</span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No instructions available</li>}
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

export default Dashboard;
