import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MovieCarouselCardProps {
  id: number;
  title: string;
  backdropPath: string;
  posterPath: string;
  voteAverage: number;
}

export const MovieCarouselCard = ({ 
  id, 
  title, 
  backdropPath, 
  posterPath,
  voteAverage 
}: MovieCarouselCardProps) => {
  // Prioriza o poster
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : backdropPath
      ? `https://image.tmdb.org/t/p/w500${backdropPath}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
      
  return (
    <Link href={`/details/${id}`} asChild>
      <TouchableOpacity 
        className="rounded-lg overflow-hidden shadow-lg mx-1" 
        style={{ width: 140 }}
      >
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-[180px]"
          resizeMode="cover"
        />
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
    </Link>
  );
};