// components/movie/details/MovieNotFound.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MovieNotFound = () => {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Ionicons name="film-outline" size={64} color="#ff4500" />
      <Text className="text-white text-lg font-bold mt-4 mb-2">
        Filme não encontrado
      </Text>
      <Text className="text-gray-300 text-center">
        Não foi possível encontrar informações para este filme.
        Verifique a conexão com a internet ou tente novamente mais tarde.
      </Text>
    </View>
  );
};