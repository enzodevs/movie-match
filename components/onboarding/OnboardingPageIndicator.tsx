// components/onboarding/OnboardingPageIndicator.tsx
import React from 'react';
import { View, Animated, Dimensions } from 'react-native';

interface OnboardingPageIndicatorProps {
  currentIndex: number;
  pageCount: number;
  scrollX: Animated.Value;
}

export const OnboardingPageIndicator: React.FC<OnboardingPageIndicatorProps> = ({ 
  currentIndex, 
  pageCount, 
  scrollX 
}) => {
  // Get screen width first before using it
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <View className="flex-row">
      {Array.from({ length: pageCount }).map((_, index) => {
        // Define input range with proper type annotation
        const inputRange: number[] = [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth
        ];
        
        // Animate the width
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 16, 8],
          extrapolate: 'clamp'
        });
        
        // Animate the opacity
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp'
        });
        
        return (
          <Animated.View
            key={`dot-${index}`}
            style={{
              width: dotWidth,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#fff',
              marginHorizontal: 4,
              opacity
            }}
          />
        );
      })}
    </View>
  );
};