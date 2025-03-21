// components/profile/ProfileStats.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileStatsProps {
  profile: any;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = profile?.stats || {
    movies_watched: 0,
    watchlist_count: 0,
    total_watch_time_minutes: 0
  };
  
  // Converter minutos em horas e formatar
  const totalHours = Math.floor(stats.total_watch_time_minutes / 60);
  
  return (
    <View className="px-6 py-4 bg-button-secondary/20 mb-4">
      <Text className="text-white text-lg font-bold mb-3">Estatísticas</Text>
      
      <View className="flex-row justify-between">
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-button-secondary items-center justify-center mb-2">
            <Ionicons name="checkmark-circle" size={24} color="#ff4500" />
          </View>
          <Text className="text-white font-bold">{stats.movies_watched}</Text>
          <Text className="text-gray-300 text-xs">Assistidos</Text>
        </View>
        
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-button-secondary items-center justify-center mb-2">
            <Ionicons name="time" size={24} color="#ff4500" />
          </View>
          <Text className="text-white font-bold">{totalHours}</Text>
          <Text className="text-gray-300 text-xs">Horas</Text>
        </View>
        
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-button-secondary items-center justify-center mb-2">
            <Ionicons name="bookmark" size={24} color="#ff4500" />
          </View>
          <Text className="text-white font-bold">{stats.watchlist_count}</Text>
          <Text className="text-gray-300 text-xs">Watchlist</Text>
        </View>
        
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-button-secondary items-center justify-center mb-2">
            <Ionicons name="star" size={24} color="#ff4500" />
          </View>
          <Text className="text-white font-bold">{profile?.favoriteMovies?.length || 0}</Text>
          <Text className="text-gray-300 text-xs">Favoritos</Text>
        </View>
      </View>
    </View>
  );
};