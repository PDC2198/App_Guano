import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AddEditFormReading from "../components/AddEditFormReading";
import { RootStackParamList } from "../types";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";

type ReadingScreenProps = NativeStackScreenProps<RootStackParamList, 'Reading'>;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>
      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}>
        <Text style={styles.title}>Agregar Lectura</Text>
      </View>
      <AddEditFormReading
        navigation={navigation}
      />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#F9FAFB", // Color de fondo más suave
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
    color: "#155dfc",
    marginTop: 30,
  }
})


export default ReadingScreen;
