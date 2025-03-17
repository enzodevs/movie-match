// Tela de onboarding

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '~/hooks/';
import { OnboardingPageIndicator } from '~/components/onboarding/OnboardingPageIndicator';
import { SignInModal } from '~/components/auth/SignInModal';

const { width, height } = Dimensions.get('window');

// Conteúdo das telas de onboarding
const PAGES = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao MovieMatch',
    description: 'Seu companheiro perfeito para descobrir, acompanhar e organizar seus filmes favoritos em um só lugar.',
    image: require('~/assets/images/placehold.png'),
    showLogin: false
  },
  {
    id: 'discover',
    title: 'Descubra Novos Filmes',
    description: 'Encontre facilmente os filmes mais populares, lançamentos e recomendações personalizadas baseadas no seu gosto.',
    image: require('~/assets/images/placehold.png'),
    showLogin: false
  },
  {
    id: 'track',
    title: 'Acompanhe Suas Experiências',
    description: 'Mantenha um registro dos filmes que você assistiu, avalie-os e compartilhe suas opiniões com amigos.',
    image: require('~/assets/images/placehold.png'),
    showLogin: false
  },
  {
    id: 'personalize',
    title: 'Personalize Sua Experiência',
    description: 'Crie listas personalizadas, adicione filmes à sua watchlist e receba recomendações exclusivas.',
    image: require('~/assets/images/placehold.png'),
    showLogin: true
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();
  
  // Se usuário já estiver autenticado, navegar para a tela de preferências
  useEffect(() => {
    if (user) {
      router.replace('../preferences');
    }
  }, [user]);
  
  // Função para avançar para a próxima página
  const handleNext = () => {
    if (currentIndex < PAGES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Na última página, mostrar modal de login ou ir para a tela principal
      if (user) {
        router.replace('../preferences');
      } else {
        setShowAuthModal(true);
      }
    }
  };
  
  // Função para pular onboarding
  const handleSkip = () => {
    if (user) {
      router.replace('../preferences');
    } else {
      setShowAuthModal(true);
    }
  };
  
  // Após login bem-sucedido
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (user) {
      router.replace('../preferences');
    }
  };
  
  return (
    <View className="flex-1 bg-primary">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Skip button */}
      <TouchableOpacity 
        onPress={handleSkip}
        className="absolute top-12 right-6 z-10"
      >
        <Text className="text-gray-300">Pular</Text>
      </TouchableOpacity>
      
      {/* Animated Carousel */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {PAGES.map((page, index) => (
          <View 
            key={page.id} 
            style={{ width, height }}
            className="justify-center items-center"
          >
            <View className="w-full h-1/2 justify-center items-center">
              <Image
                source={page.image}
                className="w-72 h-72"
                resizeMode="contain"
              />
            </View>
            
            <View className="w-full h-1/2 p-6">
              <Text className="text-white text-3xl font-bold mb-4">
                {page.title}
              </Text>
              <Text className="text-gray-300 text-lg">
                {page.description}
              </Text>
              
              {page.showLogin && !user && (
                <TouchableOpacity
                  onPress={() => setShowAuthModal(true)}
                  className="bg-secondary rounded-full py-3 px-6 mt-6 items-center"
                >
                  <Text className="text-white font-bold text-lg">Criar conta</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      
      {/* Bottom controls */}
      <View className="absolute bottom-0 left-0 right-0 h-24 px-6 flex-row justify-between items-center">
        <OnboardingPageIndicator 
          currentIndex={currentIndex}
          pageCount={PAGES.length}
          scrollX={scrollX}
        />
        
        <TouchableOpacity
          onPress={handleNext}
          className="w-14 h-14 bg-secondary rounded-full items-center justify-center"
        >
          <Ionicons 
            name={currentIndex === PAGES.length - 1 ? "checkmark" : "arrow-forward"} 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(26, 26, 26, 0.9)', '#1a1a1a']}
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
      />
      
      {/* Auth Modal */}
      <SignInModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </View>
  );
};

export default OnboardingScreen;