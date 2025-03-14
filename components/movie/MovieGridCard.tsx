// Grid card para filmes

import React from 'react';
import { Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';

interface MovieGridCardProps {
  id: number;
  posterPath: string;
}

export const MovieGridCard = ({ id, posterPath }: MovieGridCardProps) => {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - 48) / 3;
  const cardHeight = cardWidth * 1.5;

  const handlePress = () => {
    router.push(`/details/${id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="overflow-hidden rounded-lg"
      style={{ 
        width: cardWidth, 
        height: cardHeight,
        shadowColor: "#ff4500",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image 
        source={{ uri: imageUrl }}
        className="w-full h-full rounded-lg border border-button-secondary/20"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};