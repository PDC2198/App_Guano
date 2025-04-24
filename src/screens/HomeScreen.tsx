import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Dimensions,
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
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleExit = () => {
    Alert.alert('SALIR', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', onPress: () => BackHandler.exitApp() },
    ]);
  };

  const menuItems = [
    { label: 'TOMA DE LECTURA', icon: 'clipboard-text-outline', color: '#2196F3', action: () => navigation.navigate('Reading') },
    { label: 'SINCRONIZAR APP', icon: 'cloud-upload-outline', color: '#4CAF50', action: () => navigation.navigate('Send') },
    { label: 'ACERCA DE', icon: 'information-outline', color: '#FF9800', action: () => navigation.navigate('About') },
    { label: 'CERRAR SESIÓN', icon: 'logout', color: '#F44336', action: handleLogout },
    { label: 'SALIR', icon: 'exit-to-app', color: '#9C27B0', action: handleExit },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lectura de Medidores</Text>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={item.action} activeOpacity={0.8}>
            <Icon name={item.icon} size={34} color={item.color} />
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 30,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: width * 0.44,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#334155',
  },
});

export default HomeScreen;
