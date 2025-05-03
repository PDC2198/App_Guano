import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Splash: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { width, height } = useWindowDimensions();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Campos vacíos', 'Por favor, ingrese su usuario y contraseña.');
      return;
    }

    if (username === 'Root' && password === 'Root2020') {
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      width: width * 0.9,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: 16,
      paddingVertical: height * 0.05,
      paddingHorizontal: width * 0.06,
      alignItems: 'center',
      borderColor: '#fff2',
      borderWidth: 1,
    },
    title: {
      fontSize: width * 0.075,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: width * 0.04,
      color: '#ccc',
      marginBottom: 25,
    },
    inputGroup: {
      width: '100%',
      height: 50,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#aaa',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: '#fff',
      fontSize: width * 0.042,
    },
    loginButton: {
      marginTop: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0066cc',
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.08,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 6,
      elevation: 6,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: width * 0.045,
      marginRight: 5,
    },
    logoLeft: {
      width: width * 0.2,
      height: width * 0.2,
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    logoRight: {
      width: width * 0.2,
      height: width * 0.2,
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    homeButton: {
      position: 'absolute',
      top: height * 0.06,
      left: 20,
      backgroundColor: 'rgba(57, 53, 53, 0.6)',
      padding: width * 0.03,
      borderRadius: 50,
      zIndex: 10,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require('../assets/fondoGuano.jpg')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <TouchableOpacity
          style={dynamicStyles.homeButton}
          onPress={() => navigation.replace('Splash')}
        >
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.overlay} />

        <View style={dynamicStyles.container}>
          <Text style={dynamicStyles.title}>Sistema de Gestión Municipal</Text>
          <Text style={dynamicStyles.subtitle}>Inicia sesión para continuar</Text>

          <View style={dynamicStyles.inputGroup}>
            <Icon name="account" size={22} color="#ccc" style={dynamicStyles.inputIcon} />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Usuario"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={dynamicStyles.inputGroup}>
            <Icon name="lock" size={22} color="#ccc" style={dynamicStyles.inputIcon} />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#ccc" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={dynamicStyles.loginButton} onPress={handleLogin}>
            <Text style={dynamicStyles.loginButtonText}>INGRESAR</Text>
            <Icon name="login" size={20} color="#fff" style={styles.loginIcon} />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/logoGuano.jpg')}
          style={dynamicStyles.logoLeft}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/logoAgil.jpg')}
          style={dynamicStyles.logoRight}
          resizeMode="contain"
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loginIcon: {
    marginLeft: 5,
  },
});

export default LoginScreen;
