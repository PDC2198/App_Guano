import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AddEditFormReading from "../components/AddEditFormReading";
import { RootStackParamList } from "../types";
import { ScrollView, StyleSheet, Text, View, ImageBackground, useWindowDimensions, SafeAreaView, StatusBar } from "react-native";

type ReadingScreenProps = NativeStackScreenProps<RootStackParamList, 'Reading'>;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {
  const { width, height } = useWindowDimensions(); // Hook de dimensiones de la ventana

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/fondoX.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: width * 0.1 }]}>Agregar Lectura</Text>
          </View>
          <AddEditFormReading navigation={navigation} />
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
    padding: 5,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    marginTop: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
});

export default ReadingScreen;
