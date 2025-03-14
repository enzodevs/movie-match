// Home

import React, { useEffect, useState, useCallback } from 'react';
import { View, RefreshControl, FlatList } from 'react-native';
import { Stack } from 'expo-router';

import { useMovieStore } from '~/store/movieStore';
import { Header } from '~/components/layout/Header';
import { MovieGrid } from '~/components/movie/MovieGrid';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    trendingWeeklyMovies,
    fetchTrendingWeeklyMovies,
    isLoadingTrendingWeekly
  } = useMovieStore();

  useEffect(() => {
    fetchTrendingWeeklyMovies();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrendingWeeklyMovies();
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(() => {
    const total = trendingWeeklyMovies.length;
    const maxItems = 18;
    const adjustedMovies =
      total >= maxItems
        ? trendingWeeklyMovies.slice(0, maxItems)
        : trendingWeeklyMovies.slice(0, Math.floor(total / 3) * 3);
    
    return (
      <MovieGrid
        title="Populares Nessa Semana"
        movies={adjustedMovies}
        isLoading={isLoadingTrendingWeekly}
      />
    );
  }, [trendingWeeklyMovies, isLoadingTrendingWeekly]);

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header />
      
      <FlatList
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff4500']}
            tintColor="#ff4500"
          />
        }
        data={[{ key: 'movieGrid' }]}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />
    </View>
  );
}