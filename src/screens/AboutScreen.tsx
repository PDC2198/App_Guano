import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../types';


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;

const AboutScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
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
                    <Text style={styles.title}>Acerca de</Text>
                </View>

                {/* Cuerpo de la pantalla */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>¿Quiénes somos?</Text>
                    {[
                        'Tenemos la experiencia, respaldo y know-how necesario para enfrentar grandes proyectos municipales.',
                        'Contamos con el aval de profesionales de amplia trayectoria.',
                        'Creemos en la tecnología como un aliado al servicio de las personas.',
                        'Nos adaptamos a las necesidades reales de nuestros clientes.',
                        'Somos versátiles, honestos, y apasionados por hacer las cosas bien.'
                    ].map((item, index) => (
                        <Text key={index} style={styles.paragraph}>
                            {'\u2022'} {item}
                        </Text>
                    ))}

                    <Text style={styles.sectionTitle}>Contáctanos</Text>
                    <Text style={styles.paragraph}>📍 Dirección: Iñaquito, Quito – Ecuador</Text>
                    <Text style={styles.paragraph}>📞 Teléfonos: 0995979050 / 0985537862</Text>
                    <Text style={styles.paragraph}>📧 E-mail: agiledeploy@gmail.com</Text>

                    <Text style={styles.sectionTitle}>Eslogan</Text>
                    <Text style={styles.slogan}>
                        “Hazlo fácil,{'\n'}Desarrollo de soluciones tecnológicas.”
                    </Text>
                    <Image
                        source={require('../assets/logoAgil.jpg')}
                        style={styles.logo}
                    />
                    <Text style={styles.version}>Versión 1.0.0</Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
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
        borderRadius: 30,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginLeft: 20,
        color: '#000',
        //textShadowColor: '#000',
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
        fontSize: 22,
        fontWeight: '700',
        color: '#1D4ED8',
        marginBottom: 16,
        marginTop: 10,
    },
    paragraph: {
        fontSize: 16,
        color: '#1E293B',
        lineHeight: 26,
        marginBottom: 12,
    },
    slogan: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 28,
    },
    version: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 50,
        fontWeight: '700',
    },
    logo: {
        width: 300,
        height: 80,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10,
    },

});

export default AboutScreen;
