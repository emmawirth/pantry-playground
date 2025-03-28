
import React, { useState } from 'react';
import { Heart, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const foodEmojis = [
  "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🥥",
  "🥑", "🍕", "🌮", "🍔", "🍟", "🍜", "🍣", "🍰", "🍩", "🍺", "☕️"
];

const favoriteRecipes = [
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
    id: '3',
    title: 'Sweet Potato & Black Bean Tacos',
    image: 'https://images.unsplash.com/photo-1584208632869-00fa4bf85efe?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    cookTime: 30,
    ingredientsAvailable: 60,
    dietaryLabels: ['Vegan', 'High Fiber'],
    cookingLevel: 'Intermediate' as const,
  },
];

const ProfileSettings: React.FC = () => {
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
            
            <div className="grid grid-cols-2 gap-4">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  {...recipe}
                  onClick={() => {}}
                />
              ))}
            </div>
            
            {favoriteRecipes.length === 0 && (
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
