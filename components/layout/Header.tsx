import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface HeaderProps {
  hasBackButton?: boolean;
  title?: string;
}

export const Header = ({ hasBackButton = false, title = "CineMatch" }: HeaderProps) => {
  return (
    <View className="bg-primary pt-14 pb-4 px-6 flex-row items-center justify-between shadow-lg">
      <StatusBar style="light" />
      <View className="flex-row items-center gap-4">
        {hasBackButton && (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-2"
          >
            <Ionicons name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity>
        )}
        <Text className="text-heading-1">{title}</Text>
      </View>
      
      <View className="flex-row gap-5">
        <TouchableOpacity>
          <Ionicons name="search" size={28} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};