// components/onboarding/GenreSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Genre {
  id: number;
  name: string;
}

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenres: number[];
  onToggleGenre: (genreId: number) => void;
}

export const GenreSelector = ({ genres, selectedGenres, onToggleGenre }: GenreSelectorProps) => {
  return (
    <View className="flex-row flex-wrap justify-between mt-4">
      {genres.map(genre => {
        const isSelected = selectedGenres.includes(genre.id);
        
        return (
          <TouchableOpacity
            key={genre.id}
            onPress={() => onToggleGenre(genre.id)}
            className={`
              px-4 py-3 rounded-full mb-3 w-[48%]
              flex-row items-center justify-between
              ${isSelected ? 'bg-secondary' : 'bg-button-secondary/30'}
            `}
          >
            <Text 
              className={`text-white ${isSelected ? 'font-bold' : ''}`}
              numberOfLines={1}
            >
              {genre.name}
            </Text>
            
            {isSelected && (
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#ff4500" />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};