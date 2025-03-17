// components/sharing/ShareModal.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Share,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  movie: any;
}

export const ShareModal = ({ visible, onClose, movie }: ShareModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const viewShotRef = useRef<ViewShot>(null);
  const [capturing, setCapturing] = useState(false);
  
  // Templates de compartilhamento
  const templates = [
    {
      id: 'basic',
      name: 'Simples',
      bgColor: '#1a1a1a'
    },
    {
      id: 'gradient',
      name: 'Gradiente',
      bgColor: 'linear-gradient'
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      bgColor: '#000000'
    }
  ];
  
  // Função para compartilhar via share nativo
  const handleShareText = async () => {
    try {
      const result = await Share.share({
        message: 
          `Acabei de assistir ${movie.title} no MovieMatch!\n` +
          `Nota: ${movie.vote_average ? movie.vote_average.toFixed(1) : '?'}/10\n` +
          `Baixe o app para descobrir e organizar seus filmes favoritos!`
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };
  
  // Função para salvar a imagem na galeria
  const handleSaveImage = async () => {
    try {
      setCapturing(true);
      
      // Verificar permissão
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'É necessário permissão para salvar na galeria.'
        );
        setCapturing(false);
        return;
      }
      
      // Verificar se existe a função capture
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert(
          'Erro',
          'Não foi possível capturar a imagem.'
        );
        setCapturing(false);
        return;
      }
      
      // Capturar screenshot
      const uri = await viewShotRef.current.capture();
      
      if (uri) {
        // Salvar na galeria
        await MediaLibrary.saveToLibraryAsync(uri);
        
        Alert.alert(
          'Sucesso!',
          'Imagem salva na galeria.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a imagem.'
      );
    } finally {
      setCapturing(false);
    }
  };
  
  // Função para compartilhar a imagem
  const handleShareImage = async () => {
    try {
      setCapturing(true);

      
      // Verificar se existe a função capture
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert(
          'Erro',
          'Não foi possível capturar a imagem.'
        );
        setCapturing(false);
        return;
      }

      // Capturar screenshot
      const uri = await viewShotRef.current.capture();
      
      if (uri) {
        if (Platform.OS === 'ios') {
          // No iOS, usar o Share API
          await Share.share({
            url: uri,
          });
        } else {
          // No Android, usar expo-sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
          } else {
            Alert.alert(
              'Erro',
              'Compartilhamento não disponível neste dispositivo.'
            );
          }
        }
      }
    } catch (error) {
      console.error('Erro ao compartilhar imagem:', error);
      Alert.alert(
        'Erro',
        'Não foi possível compartilhar a imagem.'
      );
    } finally {
      setCapturing(false);
    }
  };
  
  // URL da imagem do poster
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  
  // Ano de lançamento
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';
  
  // Renderizar template básico
  const renderBasicTemplate = () => (
    <View style={{ width: 300, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Image 
          source={{ uri: posterUrl }}
          style={{ width: 100, height: 150, borderRadius: 8 }}
          resizeMode="cover"
        />
        
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {movie.title}
          </Text>
          
          {releaseYear && (
            <Text style={{ color: '#cccccc', fontSize: 14, marginBottom: 4 }}>
              {releaseYear}
            </Text>
          )}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="star" size={16} color="#ff4500" />
            <Text style={{ color: 'white', marginLeft: 4 }}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : '?'}/10
            </Text>
          </View>
          
          <View style={{ 
            backgroundColor: '#ff4500', 
            paddingVertical: 4, 
            paddingHorizontal: 8, 
            borderRadius: 4,
            alignSelf: 'flex-start'
          }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Recomendo!
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        padding: 8, 
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Compartilhado via MovieMatch
        </Text>
      </View>
    </View>
  );
  
  // Renderizar template com gradiente
  const renderGradientTemplate = () => (
    <LinearGradient
      colors={['#330000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: 300, padding: 16, borderRadius: 12 }}
    >
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image 
          source={{ uri: posterUrl }}
          style={{ width: 150, height: 225, borderRadius: 8 }}
          resizeMode="cover"
        />
        
        <View style={{ 
          position: 'absolute', 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="#ff4500" />
            <Text style={{ color: 'white', marginLeft: 4, fontWeight: 'bold' }}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : '?'}/10
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
        {movie.title}
      </Text>
      
      {releaseYear && (
        <Text style={{ color: '#cccccc', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
          {releaseYear}
        </Text>
      )}
      
      <View style={{ 
        backgroundColor: '#ff4500', 
        paddingVertical: 8, 
        paddingHorizontal: 12, 
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 16
      }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Acabei de assistir! 👍
        </Text>
      </View>
      
      <View style={{ 
        borderTopWidth: 1, 
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Compartilhado via MovieMatch
        </Text>
      </View>
    </LinearGradient>
  );
  
  // Renderizar template minimalista
  const renderMinimalTemplate = () => (
    <View style={{ width: 300, backgroundColor: 'black', padding: 16, borderRadius: 12 }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          {movie.title}
        </Text>
        
        {releaseYear && (
          <Text style={{ color: '#cccccc', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
            {releaseYear}
          </Text>
        )}
        
        <View style={{ 
          backgroundColor: '#ff4500', 
          paddingVertical: 8, 
          paddingHorizontal: 16, 
          borderRadius: 4
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : '?'}/10
          </Text>
        </View>
      </View>
      
      <View style={{ 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        alignItems: 'center'
      }}>
        <Text style={{ color: 'white', textAlign: 'center', fontStyle: 'italic' }}>
          "Recomendado por MovieMatch"
        </Text>
      </View>
    </View>
  );
  
  // Renderizar template atual
  const renderCurrentTemplate = () => {
    switch (templates[selectedTemplate].id) {
      case 'gradient':
        return renderGradientTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'basic':
      default:
        return renderBasicTemplate();
    }
  };
  
  if (!movie) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        style={{ flex: 1 }}
        intensity={80}
        tint="dark"
      >
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-button-secondary w-full rounded-2xl p-4 max-w-md">
            {/* Cabeçalho */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">
                Compartilhar Filme
              </Text>
              
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {/* Preview */}
            <View className="items-center mb-6">
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
              >
                {renderCurrentTemplate()}
              </ViewShot>
            </View>
            
            {/* Seletor de template */}
            <Text className="text-white mb-2">Escolha um estilo:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {templates.map((template, index) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => setSelectedTemplate(index)}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    selectedTemplate === index ? 'bg-secondary' : 'bg-button-secondary/50'
                  }`}
                >
                  <Text className="text-white">
                    {template.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Botões de compartilhamento */}
            <View className="mt-6">
              <TouchableOpacity
                onPress={handleShareImage}
                disabled={capturing}
                className={`bg-secondary py-3 rounded-lg flex-row justify-center items-center mb-3 ${capturing ? 'opacity-70' : ''}`}
              >
                <Ionicons name="share-social" size={20} color="#ffffff" />
                <Text className="text-white font-bold ml-2">
                  {capturing ? 'Processando...' : 'Compartilhar como Imagem'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSaveImage}
                disabled={capturing}
                className={`bg-button-secondary py-3 rounded-lg flex-row justify-center items-center mb-3 ${capturing ? 'opacity-70' : ''}`}
              >
                <Ionicons name="download" size={20} color="#ffffff" />
                <Text className="text-white font-bold ml-2">
                  {capturing ? 'Processando...' : 'Salvar na Galeria'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleShareText}
                className="bg-button-secondary/50 py-3 rounded-lg flex-row justify-center items-center"
              >
                <Ionicons name="text" size={20} color="#ffffff" />
                <Text className="text-white font-bold ml-2">
                  Compartilhar como Texto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};