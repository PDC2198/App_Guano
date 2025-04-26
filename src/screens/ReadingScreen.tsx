import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraCapturedPicture } from "expo-camera";
import { Asset } from "expo-media-library";
import { Controller, set, useForm } from "react-hook-form";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorMessage from "../components/ErrorMessage";
import Spinner from "../components/Spinner";
import TakePicture from "../components/TakePicture";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaFormInput, LecturaT, RootStackParamList, Rutas } from "../types";
import { rutas } from "../data/rutas";

type ReadingScreenProps = NativeStackScreenProps<RootStackParamList, "Reading">;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [observacion, setObservacion] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  //Guarda la ubicación de  la foto
  const [photoGallery, setPhotoGallery] = useState<Asset>();
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(
    undefined
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue
  } = useForm<LecturaFormInput>({
    defaultValues: {
      ruta: "",
      ordenLectura: "",
      numeroCuenta: "",
      lecturaActual: "",
      consumo: "",
      lecturaInicial: ""
    },
  });

  const lecturaActual = watch("lecturaActual");
  const lecturaInicial = watch("lecturaInicial")

  const routes = ["Ruta 1", "Ruta 2", "Ruta 3", "Ruta 4"];

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleRouteSelection = (route: string) => {
    setSelectedRoute(route);
    setRouteModalVisible(true); // Mostrar modal con el nombre de la ruta
  };

  const handleNavigateToSection1 = (ruta: Rutas) => {
    setValue("lecturaInicial", ruta.lectura)
    setValue("ordenLectura", ruta.orden.toString())
    setValue("numeroCuenta", ruta.cuenta)

    setRouteModalVisible(false); // Cerrar el modal
    setCurrentSection(0); // Ir a la sección 1 del formulario
  };

  const handleSave = async (data: LecturaFormInput) => {
    try {
      setIsLoading(true);
      const dataSend: LecturaT = {
        numeroCuenta: data.numeroCuenta,
        ruta: "1", //Por defecto
        ordenLectura: +data.ordenLectura,
        lecturaActual: +data.lecturaActual,
        consumo: +data.consumo,
        fecha: date.toString(),
        foto: photoGallery?.uri || "",
        observacion: observacion
      };

      console.log("datos: ", dataSend);

      await LecturaController.addlectura(dataSend);
      Toast.show({
        type: "success",
        text1: "Ok",
        text2: "Se guardo la lectura",
      });

      reset(); //Resetear formulario
      setObservacion('') //Resetear
      setPhotoGallery(undefined);
      setPhoto(undefined);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No se pudo guardar, error: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //UseEffect para calcular el consumo
  useEffect(() => {

    if (lecturaActual && lecturaInicial) {
      const resultado = +lecturaActual - +lecturaInicial
      setValue("consumo", resultado.toFixed(2))
    }
  }, [lecturaActual, lecturaInicial])

  const sections = [
    <View key="section1" style={styles.form}>
      {/* Filtros en la parte superior de la sección 1 */}
      <View style={styles.filtersRow}>
        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Fecha de lectura:</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(!currentSection)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString("es-ES")}
            </Text>
            <Icon name="calendar-month" size={20} color="#555" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Ruta:</Text>
          <Picker
            selectedValue={selectedRoute}
            onValueChange={(itemValue) => handleRouteSelection(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar ruta" value="" />
            {routes.map((route, index) => (
              <Picker.Item key={index} label={route} value={route} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.rowGroup}>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Órden lectura:</Text>
          <Controller
            control={control}
            name="ordenLectura"
            rules={{
              required: "Seleccione una ruta.",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Ordén de la lectura"
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors?.ordenLectura?.message && (
            <ErrorMessage message={errors.ordenLectura.message} />
          )}
        </View>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Número de cuenta:</Text>
          <Controller
            control={control}
            name="numeroCuenta"
            rules={{
              required: "Seleccione una ruta.",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Número de cuenta"
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors?.numeroCuenta?.message && (
            <ErrorMessage message={errors.numeroCuenta.message} />
          )}
        </View>
      </View>
      <View style={styles.rowGroup}>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Clave Catastral:</Text>
          <TextInput
            placeholder="Clave Catastral"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Número de medidor:</Text>
          <TextInput
            placeholder="Número de medidor"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Propietario:</Text>
        <TextInput placeholder="Propietario" style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Identificación:</Text>
        <TextInput
          placeholder="Identificación"
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.rowGroup}>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Lectura inicial (m³):</Text>

          <Controller
            control={control}
            name="lecturaInicial"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Lectura inicial"
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View style={styles.inputGroupRow}>
          <Text style={styles.greenLabel}>Lectura actual (m³):</Text>
          <Controller
            control={control}
            name="lecturaActual"
            rules={{
              required: "Seleccione una ruta.",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Lectura actual"
                style={styles.greenInput}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors?.lecturaActual?.message && (
            <ErrorMessage message={errors.lecturaActual.message} />
          )}
        </View>
      </View>
      <View style={styles.rowGroup}>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Consumo (m³):</Text>

          <Controller
            control={control}
            name="consumo"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Consumo"
                style={styles.inputDisabled}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                editable={false}

              />
            )}
          />
        </View>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Promedio consumo (m³):</Text>
          <TextInput
            placeholder="Promedio del consumo"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>,

    <View key="section2" style={styles.form}>
      <View style={styles.rowGroup}>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Variación de consumo (m³):</Text>
          <TextInput
            placeholder="Variación"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroupRow}>
          <Text style={styles.inputLabel}>Rango de consumo (m³):</Text>
          <TextInput
            placeholder="Rango"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tipo lectura:</Text>
        <TextInput placeholder="Tipo de lectura" style={styles.input} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Observación:</Text>
        <TextInput
          placeholder="Escribe una observación"
          value={observacion}
          onChangeText={setObservacion}
          style={[styles.input, { height: 70, textAlignVertical: "top" }]}
          multiline
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dirección:</Text>
        <TextInput placeholder="Dirección de la cuenta" style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Clave catastral:</Text>
        <TextInput
          placeholder="Clave catastral"
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ruta:</Text>
        <TextInput
          value={selectedRoute}
          editable={false}
          style={[styles.input, { backgroundColor: "#f2f2f2" }]}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fecha de lectura:</Text>
        <TextInput
          value={`${date.toLocaleDateString("es-ES")} ${date.toLocaleTimeString(
            "es-ES"
          )}`}
          editable={false}
          style={[styles.input, { backgroundColor: "#f2f2f2" }]}
        />
      </View>
    </View>,
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        {currentSection === 0 && ( // Mostrar botón solo en la sección 1
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="menu-open" size={30} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Título dinámico */}
        <Text style={styles.title}>
          {currentSection === 1 ? "    Detalles de la toma" : "Toma de lectura"}
        </Text>
      </View>

      {/* Contenido de la sección */}
      {typeof sections[currentSection] === "string" ? (
        <Text>{sections[currentSection]}</Text>
      ) : (
        sections[currentSection]
      )}

      {/* Controles de navegación */}
      <View>
        {currentSection > 0 && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.closeButton]}
            onPress={() => setCurrentSection(currentSection - 1)}
          >
            <Text style={styles.arrowText}>CERRAR</Text>
          </TouchableOpacity>
        )}

        {currentSection === 0 && (
          <View style={styles.actionButtons}>
            <TakePicture
              setPhotoGallery={setPhotoGallery}
              setPhoto={setPhoto}
              photo={photo}
              photoGallery={photoGallery}
            />

            <TouchableOpacity
              style={[styles.arrowButton, styles.saveButton]}
              onPress={handleSubmit(handleSave)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <Text style={styles.arrowText}>TERMINAR</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {currentSection < sections.length - 1 && (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => setCurrentSection(currentSection + 1)}
          >
            <Text style={styles.arrowText}>DETALLES</Text>
            <Icon name="arrow-right" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de ruta seleccionada */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={routeModalVisible}
        onRequestClose={() => setRouteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ruta seleccionada:</Text>
            <Text style={styles.modalText}>{selectedRoute}</Text>
            {/* Tabla */}
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.firstHeaderCell}>ORDEN</Text>
                <Text style={styles.tableHeaderCell}>CUENTA</Text>
                <Text style={styles.tableHeaderCell}>LECTURA</Text>
                <Text style={styles.tableHeaderCell}>OPCIÓN</Text>
              </View>
              {/* Filas de datos */}
              {rutas.map((ruta, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell1}> {ruta.orden}  </Text>
                  <Text style={styles.tableCell}> {ruta.cuenta} </Text>
                  <Text style={styles.tableCell}> {ruta.lectura} </Text>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleNavigateToSection1(ruta)}
                  >
                    <Text style={styles.optionButtonText}>Ir</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setRouteModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 50,
  },
  backButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 75,
  },
  form: {
    marginTop: 15,
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputGroupRow: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputGroup: {
    marginBottom: 15,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  greenInput: {
    borderWidth: 2,
    borderColor: "#28a745",
    backgroundColor: "#e9f7ef",
    borderRadius: 8,
    padding: 10,
  },
  greenLabel: {
    color: "#28a745",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    opacity: 0.5
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filter: {
    flex: 1,
    marginRight: 10,
  },
  filterLabel: {
    fontWeight: "bold",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 3,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
  },
  dateText: {
    marginRight: 30,
    fontSize: 15,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoButton: {
    backgroundColor: "#34495e",
    marginRight: 10,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 20,
    justifyContent: "center",
    flex: 1,
  },
  arrowButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  arrowText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
  closeButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 100,
    borderRadius: 15,
    width: 410,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  table: {
    marginTop: 10,
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 7,
    width: "170%",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 7,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 4,
    borderColor: "#ccc",
    paddingVertical: 15,
  },
  tableHeaderCell: {
    flex: 0.9,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  firstHeaderCell: {
    flex: 0.8, // Reducir el ancho de la primera celda
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  tableCell1: {
    flex: 0.8,
    textAlign: "center",
    justifyContent: "center",
  },
  optionButton: {
    backgroundColor: "#28a745",
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  optionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReadingScreen;
