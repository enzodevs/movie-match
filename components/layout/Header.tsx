// Header

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface HeaderProps {
  hasBackButton?: boolean;
  title?: string;
  onBack?: () => void;
}

const hitSlop = { top: 15, bottom: 15, left: 20, right: 20 };
const { height } = Dimensions.get('window');

const backButtonTopOffset = height * 0.04;

export const Header = ({ hasBackButton = false, title = "CineMatch", onBack }: HeaderProps) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="bg-primary pt-14 pb-4 px-6 flex-row items-center justify-center shadow-lg">
      <StatusBar style="light" />
      {hasBackButton && (
        <TouchableOpacity 
          onPress={handleBack}
          className="absolute left-6"
          hitSlop={hitSlop}
          style={[styles.backButton, { top: backButtonTopOffset }]} // Apply the responsive top offset
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
      <Text className="text-white text-xl font-bold">{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  }
});