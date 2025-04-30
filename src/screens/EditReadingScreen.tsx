import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AddEditFormReading from "../components/AddEditFormReading";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaRecord, RootStackParamList } from "../types";
import { ScrollView, StyleSheet, View, Text } from "react-native";

type EditReadingScreenRouteProp = RouteProp<RootStackParamList, 'EditReading'>;
type EditReading = NativeStackScreenProps<RootStackParamList>;

const EditReadingScreen: React.FC<EditReading> = ({ navigation }) => {

  const route = useRoute<EditReadingScreenRouteProp>();
  const { id } = route.params;
  const [lecturaDataEdit, setLecturaDataEdit] = useState<LecturaRecord>()

  const getLecturaById = async () => {
    try {
      const response = await LecturaController.getLecturaById(+id)
      setLecturaDataEdit(response)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLecturaById()
  }, [id])

  return (
    <ScrollView style={styles.container}>
      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}>
        <Text style={styles.title}>Editar Lectura</Text>
      </View>
      <AddEditFormReading
        navigation={navigation}
        lecturaDataEdit={lecturaDataEdit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB", // Color de fondo más suave
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "center",
    color: "#155dfc",
  }
})

export default EditReadingScreen
