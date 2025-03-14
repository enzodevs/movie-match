import { Stack } from 'expo-router';
import { View, SectionList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useMovieStore } from '~/store/movieStore';
import { Header } from '~/components/layout/Header';
import { HomeSection } from '~/components/sections/HomeSection';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    popularMovies, 
    trendingMovies,
    nowPlayingMovies,
    upcomingMovies,
    isLoadingPopular,
    isLoadingTrending,
    isLoadingNowPlaying,
    isLoadingUpcoming,
    fetchPopularMovies, 
    fetchTrendingMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies
  } = useMovieStore();

  useEffect(() => {
    // Load initial data
    fetchPopularMovies();
    fetchTrendingMovies();
    fetchNowPlayingMovies();
    fetchUpcomingMovies();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPopularMovies(),
      fetchTrendingMovies(),
      fetchNowPlayingMovies(),
      fetchUpcomingMovies()
    ]);
    setRefreshing(false);
  }, []);

  // Seções para SectionList
  const sections = [
    {
      key: 'trending',
      data: [{ 
        title: 'Em Alta Hoje',
        movies: trendingMovies,
        isLoading: isLoadingTrending,
        horizontal: true,
      }]
    },
    {
      key: 'popular',
      data: [{ 
        title: 'Populares',
        movies: popularMovies,
        isLoading: isLoadingPopular,
        horizontal: false,
      }]
    },
    {
      key: 'nowPlaying',
      data: [{ 
        title: 'Em Cartaz',
        movies: nowPlayingMovies,
        isLoading: isLoadingNowPlaying,
        horizontal: true,
      }]
    },
    {
      key: 'upcoming',
      data: [{ 
        title: 'Próximos Lançamentos',
        movies: upcomingMovies,
        isLoading: isLoadingUpcoming,
        horizontal: true,
      }]
    }
  ].filter(section => 
    section.data[0].movies.length > 0 || section.data[0].isLoading
  );

  // Espaçamento do cabeçalho responsivo
  const { height } = Dimensions.get('window');
  const headerSpacing = height * 0.04;

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header />
      
      {/* Container SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `section-${index}`}
        renderSectionHeader={() => null}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <HomeSection
            title={item.title}
            movies={item.movies}
            isLoading={item.isLoading}
            horizontal={item.horizontal}
          />
        )}
        contentContainerStyle={{ 
          paddingTop: headerSpacing,
          paddingBottom: 20
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <View style={{ height: 8 }} />
        }
      />
    </View>
  );
}