import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
};

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const [showButton, setShowButton] = useState(false);

    // Función para formatear la fecha en el formato "03 de enero del 2025"
    const formatDate = (date: Date) => {
        const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
            "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const day = date.getDate().toString().padStart(2, '0'); // Añadir un 0 si el día es menor a 10
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} de ${month} del ${year}`;
    };

    // Obtener la fecha formateada
    const currentDate = formatDate(new Date());

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true); // Muestra el botón después de 4 segundos
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const handleNavigateToLogin = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.companyName}>AGILEDEPLOY</Text>
            {/* Mostrar la fecha justo debajo del nombre de la empresa */}
            <Text style={styles.date}>{currentDate}</Text>
            {!showButton ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="INGRESAR" onPress={handleNavigateToLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        flexDirection: 'column',

    },
    companyName: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 15,  // Reduce el espacio entre el nombre y la fecha
    },
    date: {
        fontSize: 16,  // Un tamaño de fuente más pequeño que el nombre de la empresa
        color: '#555',  // Color gris para la fecha
        marginBottom: 40,  // Espaciado adicional entre la fecha y el botón
    },
});

export default SplashScreen;
