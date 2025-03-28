
import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Filter, Sparkles, Heart, Clock, User } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeSuggestions from './RecipeSuggestions';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { FilterOptions } from '@/pages/Index';

const recipesData = [
  {
    id: '1',
    title: 'Avocado & Egg Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 15,
    ingredientsAvailable: 80,
    dietaryLabels: ['Vegetarian', 'High Protein'],
    cookingLevel: 'Beginner' as const,
  },
  {
    id: '2',
    title: 'Green Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1638437447450-bc255ecca70a?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 10,
    ingredientsAvailable: 100,
    dietaryLabels: ['Vegan', 'Gluten-Free'],
    cookingLevel: 'Beginner' as const,
  },
  {
    id: '3',
    title: 'Sweet Potato & Black Bean Tacos',
    image: 'https://images.unsplash.com/photo-1584208632869-00fa4bf85efe?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 30,
    ingredientsAvailable: 60,
    dietaryLabels: ['Vegan', 'High Fiber'],
    cookingLevel: 'Intermediate' as const,
  },
  {
    id: '4',
    title: 'Lemon Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 25,
    ingredientsAvailable: 70,
    dietaryLabels: ['Keto', 'High Protein'],
    cookingLevel: 'Intermediate' as const,
  },
  {
    id: '5',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 20,
    ingredientsAvailable: 90,
    dietaryLabels: ['Vegan', 'Low Calorie'],
    cookingLevel: 'Beginner' as const,
  },
  {
    id: '6',
    title: 'Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 15,
    ingredientsAvailable: 75,
    dietaryLabels: ['Gluten-Free', 'Vegan'],
    cookingLevel: 'Beginner' as const,
  },
  {
    id: '7',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 35,
    ingredientsAvailable: 85,
    dietaryLabels: ['Vegetarian', 'Gluten-Free'],
    cookingLevel: 'Intermediate' as const,
  },
  {
    id: '8',
    title: 'Chicken Fajitas',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 25,
    ingredientsAvailable: 80,
    dietaryLabels: ['High Protein', 'Low Carb'],
    cookingLevel: 'Beginner' as const,
  },
  {
    id: '9',
    title: 'Mediterranean Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 30,
    ingredientsAvailable: 70,
    dietaryLabels: ['Vegetarian', 'Mediterranean'],
    cookingLevel: 'Intermediate' as const,
  },
  {
    id: '10',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 5,
    ingredientsAvailable: 100,
    dietaryLabels: ['High Protein', 'Low Sugar'],
    cookingLevel: 'Beginner' as const,
  },
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
  const [showFilters, setShowFilters] = useState(false);
  
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
    navigate('/recipes');
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

  const firstName = user?.user_metadata?.first_name || 'Chef';

  // Filter recipes based on search query and filter options
  const filteredRecipes = recipesData.filter(recipe => {
    // Filter by search query
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by cooking level if selected
    const matchesSkill = !filterOptions.skill || recipe.cookingLevel === filterOptions.skill;
    
    // Filter by cooking time if selected
    let matchesTime = true;
    if (filterOptions.time) {
      const [min, max] = filterOptions.time.split('-').map(Number);
      if (max) {
        matchesTime = recipe.cookTime >= min && recipe.cookTime <= max;
      } else {
        // Handle the '60+' case
        matchesTime = recipe.cookTime >= 60;
      }
    }
    
    // Filter by dietary preference if selected
    const matchesDiet = !filterOptions.diet || 
                        filterOptions.diet === 'No preference' || 
                        recipe.dietaryLabels.includes(filterOptions.diet);
    
    return matchesSearch && matchesSkill && matchesTime && matchesDiet;
  });

  return (
    <div className="pb-24">
      {/* Header Section */}
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
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-14 py-3 bg-white/90 backdrop-blur-md rounded-xl border-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-pantry-green text-white p-1 rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-3 p-4 bg-white rounded-xl shadow-lg">
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
        </div>
      </div>
      
      {/* Smart Picks */}
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
      
      {/* Pantry Summary */}
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
      
      {/* Explore Recipes */}
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

      {/* Recipe Suggestions Modal */}
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
    </div>
  );
};

export default Dashboard;
