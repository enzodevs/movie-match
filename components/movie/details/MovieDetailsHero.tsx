// // components/movie/details/MovieDetailsHero.tsx
// // Não usado na implementação parallax
// import React from 'react';
// import { View, Text, Image, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// interface MovieDetailsHeroProps {
//   movie: any;
// }

// export const MovieDetailsHero = ({ movie }: MovieDetailsHeroProps) => {
//   if (!movie) return null;
  
//   const backdropUrl = movie.backdrop_path
//     ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
//     : 'https://via.placeholder.com/780x439?text=No+Image';
    
//   const posterUrl = movie.poster_path
//     ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//     : 'https://via.placeholder.com/500x750?text=No+Image';

//   const releaseYear = movie.release_date 
//     ? new Date(movie.release_date).getFullYear() 
//     : 'N/A';
  
//   return (
//     <View className="relative">
//       <Image 
//         source={{ uri: backdropUrl }}
//         style={{ width, height: width * 0.56 }}
//         resizeMode="cover"
//       />
//       <LinearGradient
//         colors={['transparent', '#1a1a1a']}
//         style={{ position: 'absolute', bottom: 0, width: '100%', height: 100 }}
//       />
      
//       <View className="absolute bottom-0 left-0 right-0 p-4 flex-row">
//         <Image 
//           source={{ uri: posterUrl }}
//           className="w-28 h-40 rounded-lg"
//           resizeMode="cover"
//         />
//         <View className="ml-4 flex-1 justify-end">
//           <Text className="text-white text-xl font-bold">{movie.title}</Text>
//           <View className="flex-row items-center mt-1">
//             <Text className="text-gray-300">{releaseYear}</Text>
//             <View className="mx-2 w-1 h-1 rounded-full bg-gray-300" />
//             <View className="flex-row items-center">
//               <Ionicons name="star" size={16} color="#ff4500" />
//               <Text className="text-gray-300 ml-1">{movie.vote_average.toFixed(1)}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };