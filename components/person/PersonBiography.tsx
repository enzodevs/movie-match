// components/person/PersonBiography.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PersonBiographyProps {
  biography?: string;
}

export const PersonBiography = ({ biography }: PersonBiographyProps) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!biography || biography.trim() === '') {
    return (
      <View className="px-4 py-4">
        <Text className="text-white text-lg font-bold mb-2">Biografia</Text>
        <Text className="text-gray-300">Biografia não disponível.</Text>
      </View>
    );
  }
  
  const isLongText = biography.length > 250;
  const displayText = !expanded && isLongText
    ? `${biography.substring(0, 250)}...`
    : biography;
  
  return (
    <View className="px-4 py-4">
      <Text className="text-white text-lg font-bold mb-2">Biografia</Text>
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