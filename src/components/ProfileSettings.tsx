
import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const foodEmojis = [
  "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🥥",
  "🥑", "🍕", "🌮", "🍔", "🍟", "🍜", "🍣", "🍰", "🍩", "🍺", "☕️"
];

// This is shared with RecipeHub and Dashboard
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

interface ProfileSettingsProps {
  favoriteRecipes: string[];
  onToggleFavorite: (recipeId: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ favoriteRecipes, onToggleFavorite }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileEmoji, setProfileEmoji] = useState<string>("👤");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const selectEmoji = (emoji: string) => {
    setProfileEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const favoriteRecipeItems = recipesData.filter(recipe => favoriteRecipes.includes(recipe.id));

  const toggleFavorite = (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleFavorite(recipeId);
  };

  return (
    <div className="pb-24">
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => setShowEmojiPicker(true)}
            className="w-16 h-16 rounded-full bg-pantry-green/10 flex items-center justify-center text-3xl mr-4"
          >
            {profileEmoji}
          </button>
          <div>
            <h1 className="text-xl font-semibold">
              {user?.user_metadata?.first_name || 'User'} {user?.user_metadata?.last_name || ''}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Heart size={18} className="mr-2 text-pantry-green" />
              Favorites
            </h2>
            
            {favoriteRecipeItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {favoriteRecipeItems.map((recipe) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCard 
                      {...recipe}
                      onClick={() => {}}
                    />
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white"
                      onClick={(e) => toggleFavorite(recipe.id, e)}
                    >
                      <Heart size={16} fill="white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No favorite recipes yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Heart recipes to add them to your favorites
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center">
                <LogOut size={18} className="mr-3" />
                <span>Sign Out</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Emoji Picker Modal */}
      <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <DialogContent className="max-w-xs">
          <DialogTitle>Choose a Profile Picture</DialogTitle>
          <div className="grid grid-cols-5 gap-3 py-4">
            {foodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => selectEmoji(emoji)}
                className="text-3xl h-12 w-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
