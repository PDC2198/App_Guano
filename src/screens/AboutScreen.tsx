import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutScreen: React.FC = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Contenedor del botón Atrás y el título */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()} // Volver a la pantalla anterior
                >
                    <Icon name="menu-open" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Acerca de</Text>
            </View>

            {/* Contenido de la pantalla */}
            <View style={styles.content}>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Solo nosotros tenemos la experiencia suficiente, respaldo y Know-how para enfrentar proyectos.
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Solo nosotros tenemos el aval de gente con amplia trayectoria y experiencia en el medio municipal.
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Creemos que cada persona en el mundo merece usar la tecnología a su favor.
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Creemos que un sistema debe adaptarse a las personas, no las personas al sistema.
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Somos visionarios, versátiles, dúctiles, amantes de hacer las cosas bien, adaptables, amigables, sencillos y honestos.
                </Text>

                <Text style={styles.header}>Encuéntranos</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Dirección: Iñaquito, Quito – Ecuador
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    Teléfono: 0995979050 / 0985537862
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bullet}>{'\u2022'} </Text>
                    E-mail: agiledeploy@gmail.com
                </Text>

                <Text style={styles.header}>Eslogan</Text>
                <Text style={styles.paragraph}>
                    Hazlo fácil,{'\n'}
                    Desarrollo de soluciones tecnológicas{'\n'}
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        padding: 30,
        flexDirection: 'column',
        

    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 60, // Ajuste para bajar el botón y el título
    },
    backButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 75,
    },
    content: {
        marginTop: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007BFF',
    },
    paragraph: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 20,
    },

    bullet: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
    },

});

export default AboutScreen;
