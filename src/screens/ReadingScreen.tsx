import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AddEditFormReading from "../components/AddEditFormReading";
import { RootStackParamList } from "../types";
import { ScrollView, StyleSheet, Text} from "react-native";
import { View } from "react-native";

type ReadingScreenProps = NativeStackScreenProps<RootStackParamList>;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {

 return (
  <ScrollView style={styles.container}>
     <View style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
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


export default ReadingScreen;
