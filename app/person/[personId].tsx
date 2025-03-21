// app/person/[personId].tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  Animated, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  StyleSheet,
  Platform
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDateWithOptions, calculateAge, adaptCastForPersonFilmography, adaptCrewForPersonFilmography } from '~/utils/';
import { usePersonStore } from '~/store/personStore';
import { PersonBiography } from '~/components/person/PersonBiography';
import { PersonFilmography } from '~/components/person/PersonFilmography';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const BACKDROP_HEIGHT = height * 0.35; // Menor que o filme para destacar a pessoa
const PROFILE_SIZE = 150;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0;

export default function PersonDetails() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const id = Number(personId);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const { 
    fetchPersonDetails, 
    personDetails, 
    isLoadingDetails,
    fetchPersonCredits,
    personCredits
  } = usePersonStore();
  
  // Dados da pessoa atual
  const person = personDetails[id];
  const credits = personCredits[id];
  const isLoading = isLoadingDetails[id];
  
  useEffect(() => {
    // Carregar detalhes da pessoa e créditos
    fetchPersonDetails(id);
    fetchPersonCredits(id);
  }, [id]);
  
  // Cálculos para o efeito de parallax
  const headerOpacity = scrollY.interpolate({
    inputRange: [BACKDROP_HEIGHT - HEADER_HEIGHT - 40, BACKDROP_HEIGHT - HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  // Exibir carregamento
  if (!person && isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }
  
  // Exibir mensagem de pessoa não encontrada
  if (!person && !isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <View className="absolute top-16 left-4 z-10">
          <TouchableOpacity 
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="w-10 h-10 bg-button-secondary/50 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="p-4">
          <Text className="text-white text-lg font-bold text-center">
            Pessoa não encontrada
          </Text>
          <Text className="text-gray-300 text-center mt-2">
            Não foi possível encontrar informações para esta pessoa.
          </Text>
        </View>
      </View>
    );
  }
  
  // Definir URLs para imagens
  const profileUrl = person?.profile_path
    ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
    : require('~/assets/images/profile-placeholder.png');
  
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header animado */}
      <Animated.View style={[
        styles.animatedHeader,
        { opacity: headerOpacity }
      ]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.headerBackButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>{person?.name || ""}</Text>
        <View style={{ width: 40 }} />
      </Animated.View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Backdrop com parallax */}
        <View style={styles.backdropContainer}>
          
          {/* Gradiente sobre o backdrop */}
          <LinearGradient
            colors={['transparent', 'rgba(26, 26, 26, 0.8)', '#1a1a1a']}
            style={styles.backdropGradient}
          />
          
          {/* Botão voltar absoluto (sempre visível sobre o backdrop) */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Informações da pessoa sobre o backdrop */}
          <View style={styles.personInfoContainer}>
            {/* Foto do perfil */}
            <View style={styles.profileContainer}>
              <Image 
                source={typeof profileUrl === 'string' ? { uri: profileUrl } : profileUrl}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
            
            {/* Nome e detalhes */}
            <View style={styles.detailsContainer}>
              <Text style={styles.personName}>{person?.name}</Text>
              
              {person?.known_for_department && (
                <Text style={styles.detailText}>
                  {person.known_for_department === 'Acting' ? 'Atuação' : person.known_for_department}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Conteúdo adicional */}
        <View style={styles.contentContainer}>
          {/* Informações pessoais */}
          <View style={styles.infoSection}>
            {person?.birthday && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nascimento:</Text>
                <Text style={styles.infoValue}>
                  {formatDateWithOptions(person.birthday)}
                  {person.birthday && calculateAge(person.birthday) ? ` (${calculateAge(person.birthday)} anos)` : ''}
                </Text>
              </View>
            )}
            
            {person?.place_of_birth && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Local:</Text>
                <Text style={styles.infoValue}>{person.place_of_birth}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gênero:</Text>
              <Text style={styles.infoValue}>
                {person?.gender === 1 ? 'Feminino' : person?.gender === 2 ? 'Masculino' : 'Não especificado'}
              </Text>
            </View>
          </View>

          {/* Biografia */}
          <PersonBiography biography={person?.biography} />
          
          {/* Filmografia - ajustando o tipo para compatibilidade */}
          {credits && (
            <PersonFilmography 
              credits={{
                cast: credits.cast ? credits.cast.map(adaptCastForPersonFilmography) : [],
                crew: credits.crew ? credits.crew.map(adaptCrewForPersonFilmography) : []
              }} 
            />
          )}
          
          {/* Espaço extra no final */}
          <View style={{ height: 30 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT,
    zIndex: 10,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backdropContainer: {
    height: BACKDROP_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  backdropImage: {
    width: width,
    height: BACKDROP_HEIGHT,
    position: 'absolute',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT,
    zIndex: 3,
  },
  backButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 10,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  personInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 4,
  },
  profileContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 3,
    borderColor: '#1a1a1a',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 4,
  },
  personName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    paddingTop: 0,
    backgroundColor: '#1a1a1a',
    position: 'relative',
    zIndex: 5,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#ff4500',
    fontWeight: 'bold',
    marginRight: 6,
  },
  infoValue: {
    color: 'white',
    flex: 1,
  }
});