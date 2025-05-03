import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Image, ImageBackground, SafeAreaView, StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from '../components/Spinner';
import { initDatabase } from '../models/LecturoModel';
import { useWindowDimensions } from 'react-native';


type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
};

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const [showButton, setShowButton] = useState(false);
    const { width, height } = useWindowDimensions(); // 👈 dimensiones dinámicas

    const formatDate = (date: Date) => {
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
            "septiembre", "octubre", "noviembre", "diciembre"];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} de ${month} del ${year}`;
    };

    const currentDate = formatDate(new Date());

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        initDatabase();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ImageBackground
                source={require('../assets/fondoGuano.jpg')}
                style={[styles.background, { width, height }]} // 👈 full responsive
                imageStyle={{ resizeMode: 'cover' }}
            >
                <View style={styles.overlay} />

                <View style={[
                    styles.container,
                    {
                        width: width * 0.9, // 👈 90% del ancho
                        paddingVertical: height * 0.05, // ajusta según alto
                        paddingHorizontal: width * 0.06,
                    }
                ]}>
                    <Text style={[
                        styles.companyName,
                        { fontSize: width < 350 ? 18 : 24 } // 👈 adapta tamaño fuente
                    ]}>
                        GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN GUANO
                    </Text>

                    <Text style={styles.date}>{currentDate}</Text>

                    {!showButton ? (
                        <Spinner />
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
                            <Icon name="login" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                <Image
                    source={require('../assets/logoGuano.jpg')}
                    style={[styles.logoLeft, { width: width * 0.22, height: width * 0.22 }]} // 👈 ajusta proporcionalmente
                    resizeMode="contain"
                />

                <Image
                    source={require('../assets/logoAgil.jpg')}
                    style={[styles.logoRight, { width: width * 0.22, height: width * 0.22 }]}
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
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    container: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        paddingVertical: 40,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderColor: '#fff2',
        borderWidth: 1,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    date: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    loader: {
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0066cc',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
        marginRight: 8,
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

export default SplashScreen;
