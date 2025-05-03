import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Pressable,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { width, height } = useWindowDimensions(); // Hook de dimensiones de la ventana

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
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.title, { fontSize: width * 0.07 }]}>App de toma de lecturas de agua potable</Text>

          <View style={styles.importantButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.mainCard,
                { backgroundColor: '#1D4ED8' },
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate('Reading')}
            >
              <Icon name="clipboard-text-outline" size={width * 0.1} color="#fff" />
              <Text style={[styles.mainText, { fontSize: width * 0.05 }]}>TOMA DE LECTURA</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.mainCard,
                { backgroundColor: '#047857' },
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate('Send')}
            >
              <Icon name="cloud-upload-outline" size={width * 0.1} color="#fff" />
              <Text style={[styles.mainText, { fontSize: width * 0.05 }]}>SINCRONIZAR APP</Text>
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
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Icon name="copyright" size={20} color={"#888"} />
            <Text style={[styles.footerText, { fontSize: width * 0.035 }]}>Desarrollado por AgileDeploy S.A</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '5%',
  },
  title: {
    fontWeight: '800',
    color: '#000',
    marginBottom: '5%',
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  importantButtons: {
    width: '100%',
    gap: 20,
    marginBottom: '4%',
  },
  mainCard: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: '3%',
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
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  secondaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  secondaryCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: '2.5%',
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryText: {
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
    color: '#334155',
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    marginLeft: 5,
  },
});

export default HomeScreen;
