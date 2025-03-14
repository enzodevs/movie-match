import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate?: string;
}

export const MovieCard = ({ 
  id, 
  title, 
  posterPath, 
  voteAverage, 
  releaseDate
}: MovieCardProps) => {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.getFullYear();
  };

  const handlePress = () => {
    router.push(`/details/${id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="rounded-lg overflow-hidden m-0.5 mb-3"
      style={{ width: 162 }}
    >
      <View className="relative">
        <Image 
          source={{ uri: imageUrl }}
          className="w-full h-[225px]" 
          resizeMode="cover"
        />
        {releaseDate && (
          <View className="absolute top-0 right-0 bg-black/50 py-1 px-2 rounded-bl-lg">
            <Text className="text-white text-xs font-medium">
              {formatDate(releaseDate)}
            </Text>
          </View>
        )}
      </View>
      
      <View className="p-3 bg-button-secondary h-[80px] flex-col justify-between">
        <Text className="text-white font-medium text-sm" numberOfLines={2}>
          {title}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#ff4500" />
          <Text className="text-secondary text-sm ml-1 font-medium">
            {voteAverage.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};