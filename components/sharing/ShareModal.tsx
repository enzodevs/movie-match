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
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const viewShotRef = useRef<ViewShot>(null);
  const [capturing, setCapturing] = useState<boolean>(false);

  const templates = [
    { id: 'basic', name: 'Simples' },
    { id: 'gradient', name: 'Gradiente' }
  ];

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear().toString()
    : '';

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
          {releaseYear !== '' && (
            <Text style={{ color: '#cccccc', fontSize: 14, marginBottom: 4 }}>
              {releaseYear}
            </Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="star" size={16} color="#ff4500" />
            <Text style={{ color: 'white', marginLeft: 4 }}>
              {movie.vote_average?.toFixed(1) ?? '?'}/10
            </Text>
          </View>
          <View style={{ backgroundColor: '#ff4500', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, alignSelf: 'flex-start' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Recomendo!
            </Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Compartilhado via MovieMatch
        </Text>
      </View>
    </View>
  );

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
        <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="#ff4500" />
            <Text style={{ color: 'white', marginLeft: 4, fontWeight: 'bold' }}>
              {movie.vote_average?.toFixed(1) ?? '?'}/10
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
        {movie.title}
      </Text>
      {releaseYear !== '' && (
        <Text style={{ color: '#cccccc', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
          {releaseYear}
        </Text>
      )}
      <View style={{ backgroundColor: '#ff4500', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'center', marginBottom: 16 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Acabei de assistir! 👍
        </Text>
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Compartilhado via MovieMatch
        </Text>
      </View>
    </LinearGradient>
  );

  const renderCurrentTemplate = () => {
    return selectedTemplate === 1 ? renderGradientTemplate() : renderBasicTemplate();
  };

  const handleShareText = async () => {
    try {
      await Share.share({
        message: `Acabei de assistir ${movie.title} no MovieMatch!\nNota: ${movie.vote_average?.toFixed(1) ?? '?'}\/10` +
                 '\nBaixe o app para descobrir e organizar seus filmes favoritos!'
      });
    } catch (err) {
      console.error('Erro ao compartilhar texto:', err);
    }
  };

  const handleSaveImage = async () => {
    setCapturing(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permissão para salvar na galeria.');
        return;
      }
      const shot = viewShotRef.current;
      if (!shot || typeof shot.capture !== 'function') {
        Alert.alert('Erro', 'Não foi possível capturar a imagem.');
        return;
      }
      const uri = await shot.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Sucesso!', 'Imagem salva na galeria.');
    } catch (err) {
      console.error('Erro ao salvar imagem:', err);
      Alert.alert('Erro', 'Não foi possível salvar a imagem.');
    } finally {
      setCapturing(false);
    }
  };

  const handleShareImage = async () => {
    setCapturing(true);
    try {
      const shot = viewShotRef.current;
      if (!shot || typeof shot.capture !== 'function') {
        Alert.alert('Erro', 'Não foi possível capturar a imagem.');
        return;
      }
      const uri = await shot.capture();
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: 'image/jpeg' });
      } else {
        await Share.share({ url: uri });
      }
    } catch (err: any) {
      console.error('Erro ao compartilhar imagem:', err);
      Alert.alert('Erro', err.message || 'Não foi possível compartilhar a imagem.');
    } finally {
      setCapturing(false);
    }
  };

  if (!visible || !movie) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView style={{ flex: 1 }} intensity={80} tint="dark">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: '#2c2c2e', borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Compartilhar Filme</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}> 
                {renderCurrentTemplate()}
              </ViewShot>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {templates.map((t, i) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSelectedTemplate(i)}
                  style={{ marginRight: 8, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12,
                    backgroundColor: i === selectedTemplate ? '#ff4500' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <Text style={{ color: 'white' }}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity
                onPress={handleShareImage}
                disabled={capturing}
                style={{ backgroundColor: '#ff4500', paddingVertical: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' }}
              >
                <Ionicons name="share-social" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4 }}>
                  {capturing ? 'Processando...' : 'Compartilhar Imagem'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveImage}
                disabled={capturing}
                style={{ backgroundColor: '#3a3a3c', paddingVertical: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' }}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4 }}>
                  {capturing ? 'Processando...' : 'Salvar na Galeria'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShareText}
                disabled={capturing}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
              >
                <Ionicons name="text" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4 }}>
                  {capturing ? 'Processando...' : 'Compartilhar Texto'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
