// components/person/PersonFilmography.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { MovieGridCard } from '~/components/movie/MovieGridCard';

interface Credit {
  id: number;
  title: string;
  poster_path: string;
  character?: string;
  job?: string;
  popularity: number;
}

interface PersonFilmographyProps {
  credits: {
    cast?: Credit[];
    crew?: Credit[];
  };
  title?: string;
}

export const PersonFilmography: React.FC<PersonFilmographyProps> = ({ 
  credits, 
  title = "Filmografia" 
}) => {
  if (!credits || (!credits.cast?.length && !credits.crew?.length)) {
    return (
      <View className="px-4 pt-4 pb-28">
        <Text className="text-white text-lg font-bold mb-3">{title}</Text>
        <Text className="text-gray-400">Nenhum filme encontrado.</Text>
      </View>
    );
  }
  
  // Combinar e ordenar por popularidade
  const allMovies = [...(credits.cast || []), ...(credits.crew || [])];
  const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
  const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);
  
  return (
    <View className="px-4 pt-4 pb-28">
      <Text className="text-white text-lg font-bold mb-3">{title}</Text>
      <FlatList
        data={sortedMovies.slice(0, 20)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Determinar se é atuação ou equipe técnica
          const role = credits.cast?.find((c: Credit) => c.id === item.id) 
            ? item.character 
            : item.job;
          
          return (
            <View className="mr-3">
              <MovieGridCard 
                id={item.id} 
                posterPath={item.poster_path} 
              />
              <Text className="text-white text-xs mt-1 w-24" numberOfLines={1}>
                {item.title}
              </Text>
              {role && (
                <Text className="text-gray-400 text-xs w-24" numberOfLines={1}>
                  {role}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};