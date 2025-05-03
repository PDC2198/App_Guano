import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AddEditFormReading from "../components/AddEditFormReading";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaRecord, RootStackParamList } from "../types";
import { ScrollView, StyleSheet, View, Text, ImageBackground, SafeAreaView, StatusBar } from "react-native";

type EditReadingScreenRouteProp = RouteProp<RootStackParamList, 'EditReading'>;
type EditReading = NativeStackScreenProps<RootStackParamList, 'EditReading'>;

const EditReadingScreen: React.FC<EditReading> = ({ navigation }) => {
  const route = useRoute<EditReadingScreenRouteProp>();
  const { id } = route.params;
  const [lecturaDataEdit, setLecturaDataEdit] = useState<LecturaRecord>();

  const getLecturaById = async () => {
    try {
      const response = await LecturaController.getLecturaById(+id);
      setLecturaDataEdit(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLecturaById();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require("../assets/fondoX.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Lectura</Text>
          </View>
          <AddEditFormReading
            navigation={navigation}
            lecturaDataEdit={lecturaDataEdit}
          />
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
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginTop: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
});

export default EditReadingScreen;
