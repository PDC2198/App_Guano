import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require('../assets/fondoGuano.jpg')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.overlay} />

        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.inputGroup}>
            <Icon name="account" size={22} color="#ccc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Icon name="lock" size={22} color="#ccc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>INGRESAR</Text>
            <Icon name="login" size={20} color="#fff" style={styles.loginIcon} />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/logoGuano.jpg')}
          style={styles.logoLeft}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/logoAgil.jpg')}
          style={styles.logoRight}
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
  container: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderColor: '#fff2',
    borderWidth: 1,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
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
    fontSize: 16,
  },
  loginButton: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
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
    fontSize: 18,
    marginRight: 5,
  },
  loginIcon: {
    marginLeft: 5,
  },
  logoLeft: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  logoRight: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default LoginScreen;
