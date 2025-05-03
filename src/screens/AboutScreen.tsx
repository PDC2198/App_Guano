import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, useWindowDimensions, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;

const AboutScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { width, height } = useWindowDimensions(); // Hook para obtener dimensiones de la ventana

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ImageBackground
                source={require('../assets/fondoX.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Encabezado */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="menu-open" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={[styles.title, { fontSize: width * 0.08 }]}>Acerca de</Text>
                    </View>

                    {/* Cuerpo de la pantalla */}
                    <View style={styles.content}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.05 }]}>¿Quiénes somos?</Text>
                        {[
                            'Tenemos la experiencia, respaldo y know-how necesario para enfrentar grandes proyectos municipales.',
                            'Contamos con el aval de profesionales de amplia trayectoria.',
                            'Creemos en la tecnología como un aliado al servicio de las personas.',
                            'Nos adaptamos a las necesidades reales de nuestros clientes.',
                            'Somos versátiles, honestos, y apasionados por hacer las cosas bien.'
                        ].map((item, index) => (
                            <Text key={index} style={[styles.paragraph, { fontSize: width * 0.040 }]}>
                                {'\u2022'} {item}
                            </Text>
                        ))}

                        <Text style={[styles.sectionTitle, { fontSize: width * 0.05 }]}>Contáctanos</Text>
                        <Text style={[styles.paragraph, { fontSize: width * 0.040 }]}>📍 Dirección: Iñaquito, Quito – Ecuador</Text>
                        <Text style={[styles.paragraph, { fontSize: width * 0.040 }]}>📞 Teléfonos: 0995979050 / 0985537862</Text>
                        <Text style={[styles.paragraph, { fontSize: width * 0.040 }]}>📧 E-mail: agiledeploy@gmail.com</Text>

                        <Text style={[styles.sectionTitle, { fontSize: width * 0.05 }]}>Eslogan</Text>
                        <Text style={[styles.slogan, { fontSize: width * 0.04 }]}>
                            “Hazlo fácil,{'\n'}Desarrollo de soluciones tecnológicas.”
                        </Text>
                        <Image
                            source={require('../assets/logoAgil.jpg')}
                            style={[styles.logo, { width: width * 0.4, height: height * 0.1 }]}
                        />
                        <Text style={[styles.version, { fontSize: width * 0.04 }]}>Versión 1.0.0</Text>
                    </View>
                </ScrollView>
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
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: '5%',
        paddingTop: 60,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        backgroundColor: '#1D4ED8',
        padding: 10,
        borderRadius: 16,
        elevation: 4,
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 20,
        color: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontWeight: '700',
        color: '#1D4ED8',
        marginBottom: 16,
        marginTop: 10,
    },
    paragraph: {
        color: '#1E293B',
        lineHeight: 26,
        marginBottom: 12,
    },
    slogan: {
        fontStyle: 'italic',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 28,
    },
    version: {
        color: '#64748B',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '700',
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
});

export default AboutScreen;
