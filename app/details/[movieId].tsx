// app/details/[movieId].tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  ActivityIndicator, 
  Animated, 
  TouchableOpacity, 
  Text, 
  Dimensions, 
  StatusBar,
  StyleSheet,
  Platform
} from 'react-native';

import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useMovieStore, useProfileStore } from '~/store/';
import { useAuth } from '~/hooks';
import {
  MovieGenres,
  MovieOverview,
  MovieActions,
  MovieCast,
  MovieSimilar,
  MovieNotFound
} from '~/components/movie/details/';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const BACKDROP_HEIGHT = height * 0.42; // Aumentei ligeiramente para dar mais espaço
const POSTER_WIDTH = 120;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0;

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const id = Number(movieId);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Auth hooks
  const { user } = useAuth();
  
  // Movie hooks
  const { 
    fetchMovieDetails, 
    movieDetails, 
    isLoadingDetails,
    fetchMovieCredits,
    movieCredits,
    fetchSimilarMovies,
    similarMovies,
  } = useMovieStore();
  
  // Profile hooks para interações do usuário
  const {
    watchedMovies,
    favoriteMovies,
    watchlistMovies,
    fetchWatchedMovies,
    fetchFavoriteMovies,
    fetchWatchlistMovies,
    addToWatched,
    removeFromWatched,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist
  } = useProfileStore();
  
  // Dados do filme atual
  const movie = movieDetails[id];
  const isLoading = isLoadingDetails[id];
  
  useEffect(() => {
    // Carregar detalhes do filme, elenco e filmes similares
    fetchMovieDetails(id);
    fetchMovieCredits(id);
    fetchSimilarMovies(id);
    
    // Se o usuário estiver autenticado, carregar suas listas
    if (user) {
      fetchWatchedMovies();
      fetchFavoriteMovies();
      fetchWatchlistMovies();
    }
  }, [id, user]);
  
  // Estados de interação do usuário com o filme
  const isWatched = user ? watchedMovies.includes(id) : false;
  const isFavorite = user ? favoriteMovies.includes(id) : false;
  const isInWatchlist = user ? watchlistMovies.includes(id) : false;
  
  // Funções para ações do usuário
  const handleToggleWatched = async () => {
    if (!user) return;
    
    if (isWatched) {
      await removeFromWatched(id);
    } else {
      await addToWatched(id);
      
      // Se estava na watchlist, remover automaticamente
      if (isInWatchlist) {
        await removeFromWatchlist(id);
      }
    }
  };
  
  const handleToggleFavorite = async () => {
    if (!user) return;
    
    if (isFavorite) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites(id);
    }
  };
  
  const handleToggleWatchlist = async () => {
    if (!user) return;
    
    if (isInWatchlist) {
      await removeFromWatchlist(id);
    } else {
      if (isWatched) {
        // Não pode adicionar à watchlist se já foi assistido
        return;
      }
      await addToWatchlist(id);
    }
  };
  
  // Cálculos para o efeito de parallax - ajustados para evitar cortes
  const backdropScale = scrollY.interpolate({
    inputRange: [-300, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp'
  });
  
  // Ajustado para começar com uma posição negativa e assim mostrar mais da parte superior
  const backdropTranslateY = scrollY.interpolate({
    inputRange: [-300, 0, BACKDROP_HEIGHT],
    outputRange: [-30, -20, BACKDROP_HEIGHT / 3],
    extrapolate: 'clamp'
  });
  
  const backdropOpacity = scrollY.interpolate({
    inputRange: [BACKDROP_HEIGHT - 100, BACKDROP_HEIGHT],
    outputRange: [1, 0.3],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [BACKDROP_HEIGHT - HEADER_HEIGHT - 40, BACKDROP_HEIGHT - HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  // Exibir carregamento
  if (!movie && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }
  
  // Exibir mensagem de filme não encontrado
  if (!movie && !isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <MovieNotFound />
      </View>
    );
  }
  
  // URLs para imagens
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';
    
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  
  // Ano de lançamento
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : '';
  
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
        <Text numberOfLines={1} style={styles.headerTitle}>{movie.title}</Text>
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
          <Animated.Image 
            source={{ uri: backdropUrl }}
            style={[
              styles.backdropImage,
              { 
                transform: [
                  { scale: backdropScale },
                  { translateY: backdropTranslateY }
                ],
                opacity: backdropOpacity
              }
            ]}
            resizeMode="cover"
          />
          
          {/* Gradiente sobre o backdrop */}
          <LinearGradient
            colors={['transparent', 'rgba(26, 26, 26, 0.6)', '#1a1a1a']}
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
          
          {/* Informações do filme sobre o backdrop */}
          <View style={styles.movieInfoContainer}>
            {/* Poster */}
            <View style={styles.posterContainer}>
              <Animated.Image 
                source={{ uri: posterUrl }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            </View>
            
            {/* Título e detalhes */}
            <View style={styles.detailsContainer}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              
              <View style={styles.detailsRow}>
                {releaseYear && <Text style={styles.detailText}>{releaseYear}</Text>}
                
                {movie.vote_average > 0 && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#ff4500" />
                    <Text style={styles.detailText}>
                      {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        
        {/* Conteúdo do filme */}
        <View style={styles.contentContainer}>
          {/* Gêneros */}
          <MovieGenres genres={movie.genres} />
          
          {/* Sinopse */}
          <MovieOverview overview={movie.overview} />
          
          {/* Botões de ação (Assistido, Favorito, Watchlist) */}
          <MovieActions
            isWatched={isWatched}
            isFavorite={isFavorite}
            isInWatchlist={isInWatchlist}
            onToggleWatched={handleToggleWatched}
            onToggleFavorite={handleToggleFavorite}
            onToggleWatchlist={handleToggleWatchlist}
            isUserLoggedIn={!!user}
            movie={movie}
          />
          
          {/* Elenco */}
          <MovieCast
            movieId={id}
            credits={movieCredits[id]}
          />
          
          {/* Filmes Similares */}
          <MovieSimilar
            movieId={id}
            similarMovies={similarMovies[id]}
          />
          
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
  loadingContainer: {
    flex: 1, 
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center'
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
    height: BACKDROP_HEIGHT + 40, 
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
  movieInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 4,
  },
  posterContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 4,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    paddingTop: 0,
    backgroundColor: '#1a1a1a',
    position: 'relative',
    zIndex: 5,
  },
});