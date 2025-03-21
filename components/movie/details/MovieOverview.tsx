// components/movie/details/MovieOverview.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MovieOverviewProps {
  overview?: string;
}

export const MovieOverview = ({ overview }: MovieOverviewProps) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!overview) {
    return (
      <View className="px-4 py-3">
        <Text className="text-white text-lg font-bold mb-2">Sinopse</Text>
        <Text className="text-gray-300">Sinopse não disponível.</Text>
      </View>
    );
  }
  
  const isLongText = overview.length > 150;
  const displayText = !expanded && isLongText
    ? `${overview.substring(0, 150)}...`
    : overview;
  
  return (
    <View className="px-4 py-3">
      <Text className="text-white text-lg font-bold mb-2">Sinopse</Text>
      <Text className="text-gray-300">
        {displayText}
      </Text>
      
      {isLongText && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="mt-2"
        >
          <Text className="text-secondary font-bold">
            {expanded ? 'Ver menos' : 'Ver mais'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};