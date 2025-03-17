// components/person/PersonDetailsHero.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

interface PersonDetailsHeroProps {
  person: any;
}

export const PersonDetailsHero = ({ person }: PersonDetailsHeroProps) => {
  if (!person) return null;
  
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
    : require('~/assets/images/profile-placeholder.png');
    
  // Formatar idade
  const calculateAge = () => {
    if (!person.birthday) return null;
    
    const birthDate = new Date(person.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Formatar data de nascimento
  const formatBirthday = () => {
    if (!person.birthday) return 'Data de nascimento desconhecida';
    
    const date = new Date(person.birthday);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Determinar gênero
  const getGender = () => {
    switch(person.gender) {
      case 1:
        return 'Feminino';
      case 2:
        return 'Masculino';
      default:
        return 'Não especificado';
    }
  };
  
  return (
    <View className="relative">
      <View className="bg-primary p-4 flex-row">
        <Image 
          source={typeof profileUrl === 'string' ? { uri: profileUrl } : profileUrl}
          className="w-32 h-44 rounded-lg"
          resizeMode="cover"
        />
        <View className="ml-4 flex-1 justify-center">
          <Text className="text-white text-xl font-bold">{person.name}</Text>
          
          {person.known_for_department && (
            <Text className="text-gray-300 mt-1">
              {person.known_for_department === 'Acting' ? 'Atuação' : person.known_for_department}
            </Text>
          )}
          
          <View className="mt-4">
            {person.birthday && (
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-300 text-sm">
                  Nascimento: {formatBirthday()}
                  {calculateAge() ? ` (${calculateAge()} anos)` : ''}
                </Text>
              </View>
            )}
            
            {person.place_of_birth && (
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-300 text-sm">
                  Local: {person.place_of_birth}
                </Text>
              </View>
            )}
            
            <View className="flex-row items-center">
              <Text className="text-gray-300 text-sm">
                Gênero: {getGender()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};