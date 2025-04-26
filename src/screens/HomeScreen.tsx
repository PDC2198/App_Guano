import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Reading: undefined;
  About: undefined;
  Send: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('CERRAR SESIÓN', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  const handleExit = () => {
    Alert.alert('SALIR', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', onPress: () => BackHandler.exitApp() },
    ]);
  };

  return (
    <ImageBackground
      source={require('../assets/fondoX.jpg')} 
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <Text style={styles.title}>App de toma de lecturas de agua potable</Text>

      <View style={styles.importantButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.mainCard,
            { backgroundColor: '#1D4ED8' },
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('Reading')}
        >
          <Icon name="clipboard-text-outline" size={44} color="#fff" />
          <Text style={styles.mainText}>TOMA DE LECTURA</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.mainCard,
            { backgroundColor: '#047857' },
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('Send')}
        >
          <Icon name="cloud-upload-outline" size={44} color="#fff" />
          <Text style={styles.mainText}>SINCRONIZAR APP</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={() => navigation.navigate('About')}
        >
          <Icon name="information-outline" size={28} color="#F59E0B" />
          <Text style={styles.secondaryText}>ACERCA DE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryCard} onPress={handleLogout}>
          <Icon name="logout" size={28} color="#EF4444" />
          <Text style={styles.secondaryText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryCard} onPress={handleExit}>
          <Icon name="exit-to-app" size={28} color="#8B5CF6" />
          <Text style={styles.secondaryText}>SALIR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Esto asegura que la imagen cubra toda la pantalla
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000',
    marginBottom: 36,
    textAlign: 'center',
    //textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  importantButtons: {
    width: '100%',
    gap: 15,
    marginBottom: 36,
  },
  mainCard: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  mainText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  secondaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  secondaryCard: {
    width: width * 0.3,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 25,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#334155',
  },
});

export default HomeScreen;
