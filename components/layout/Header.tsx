// Header

import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface HeaderProps {
  hasBackButton?: boolean;
  title?: string;
}

const hitSlop = { top: 15, bottom: 15, left: 20, right: 20 };
const { height } = Dimensions.get('window'); // Get screen height

// Calculate a responsive top offset based on screen height
const backButtonTopOffset = height * 0.04; // Adjust the 0.03 value to control the offset

export const Header = ({ hasBackButton = false, title = "CineMatch" }: HeaderProps) => {
  return (
    <View className="bg-primary pt-14 pb-4 px-6 flex-row items-center justify-center shadow-lg">
      <StatusBar style="light" />
      {hasBackButton && (
        <TouchableOpacity 
          onPress={() => router.back()}
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
    paddingVertical: 10, // Add some vertical padding
    paddingHorizontal: 10, // Add some horizontal padding
  }
});