// components/movie/details/MovieGenres.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface Genre {
  id: number;
  name: string;
}

interface MovieGenresProps {
  genres?: Genre[];
}

export const MovieGenres = ({ genres }: MovieGenresProps) => {
  if (!genres || genres.length === 0) return null;
  
  return (
    <FlatList
      data={genres}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View 
          className="bg-button-secondary/20 px-3 py-1 rounded-full mr-2"
        >
          <Text className="text-white text-xs">{item.name}</Text>
        </View>
      )}
    />
  );
};