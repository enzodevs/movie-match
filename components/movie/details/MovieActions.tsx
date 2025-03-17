// components/movie/details/MovieActions.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ShareModal } from '~/components/sharing/ShareModal';
import React, { useState } from 'react';

interface MovieActionsProps {
  movie: any;
  isWatched: boolean;
  isFavorite: boolean;
  isInWatchlist: boolean;
  onToggleWatched: () => void;
  onToggleFavorite: () => void;
  onToggleWatchlist: () => void;
  isUserLoggedIn: boolean;
}

export const MovieActions = ({
  isWatched,
  isFavorite,
  isInWatchlist,
  onToggleWatched,
  onToggleFavorite,
  onToggleWatchlist,
  isUserLoggedIn,
  movie
  
}: MovieActionsProps) => {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  // Função para compartilhar filme
  const handleShare = async () => {
    setShowShareModal(true);
  };
  
  // Função para lidar com ações quando o usuário não está logado
  const handleUnauthenticatedAction = () => {
    // Redirecionar para tela de login/registro
    router.push('/onboarding');
  };

  
  
  return (
    <View className="px-4 py-4">
      {/* Primary actions */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          onPress={isUserLoggedIn ? onToggleWatched : handleUnauthenticatedAction}
          className={`flex-1 py-3 px-2 rounded-lg flex-row items-center justify-center mr-2 ${
            isWatched ? 'bg-green-600' : 'bg-button-primary'
          }`}
        >
          <Ionicons 
            name={isWatched ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={20} 
            color="#ffffff" 
          />
          <Text className="text-white font-bold ml-2">
            {isWatched ? 'Assistido' : 'Já assisti'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={isUserLoggedIn ? onToggleWatchlist : handleUnauthenticatedAction}
          disabled={isWatched}
          className={`flex-1 py-3 px-2 rounded-lg flex-row items-center justify-center ml-2 ${
            isInWatchlist 
              ? 'bg-blue-600' 
              : isWatched 
                ? 'bg-button-secondary/30'
                : 'bg-button-secondary'
          }`}
        >
          <Ionicons 
            name={isInWatchlist ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color="#ffffff" 
          />
          <Text className="text-white font-bold ml-2">
            {isInWatchlist ? 'Na watchlist' : 'Assistir depois'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Secondary actions */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={isUserLoggedIn ? onToggleFavorite : handleUnauthenticatedAction}
          className="flex-row items-center"
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#ff4500" : "#ffffff"} 
          />
          <Text className="text-white ml-1">
            {isFavorite ? 'Favorito' : 'Favoritar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row items-center"
        >
          <Ionicons name="share-social-outline" size={24} color="#ffffff" />
          <Text className="text-white ml-1">Compartilhar</Text>
        </TouchableOpacity>        
      </View>
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        movie={movie}
      />
    </View>
  );
};