import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraCapturedPicture } from "expo-camera";
import { Asset } from "expo-media-library";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import MessageAlert from "../components/MessageAlert";
import Spinner from "../components/Spinner";
import TakePicture from "../components/TakePicture";
import { LecturaController } from "../controllers/LecturaController";
import { rutas } from "../data/rutas";
import { LecturaFormInput, LecturaT, RootStackParamList, Ruta } from "../types";

type ReadingScreenProps = NativeStackScreenProps<RootStackParamList, "Reading">;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [observacion, setObservacion] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  //Guarda la ubicación de  la foto
  const [photoGallery, setPhotoGallery] = useState<Asset>();
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(
    undefined
  );

  //Manejar la siguiente ruta
  const [rutaSelect, setRutaSelect] = useState<Ruta>();
  const [message, setMessage] = useState(""); //mensajes de la aplicación

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LecturaFormInput>({
    defaultValues: {
      ruta: "",
      ordenLectura: "",
      numeroCuenta: "",
      lecturaActual: "",
      consumo: "",
      lecturaInicial: "",
    },
  });

  const lecturaActual = watch("lecturaActual");
  const lecturaInicial = watch("lecturaInicial");

  const routes = ["Ruta 1", "Ruta 2", "Ruta 3", "Ruta 4"];

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleRouteSelection = (route: string) => {
    setSelectedRoute(route);
    setRouteModalVisible(true); // Mostrar modal con el nombre de la ruta
  };

  //Toma la ruta seleccionada
  const handleNavigateToSection1 = (ruta: Ruta) => {
    setValue("lecturaInicial", ruta.lectura);
    setValue("ordenLectura", ruta.orden.toString());
    setValue("numeroCuenta", ruta.cuenta);

    setRouteModalVisible(false); // Cerrar el modal
    setCurrentSection(0); // Ir a la sección 1 del formulario
    setRutaSelect(ruta); //Setear la ruta seleccionada
  };

  // Dirige a la siguiente ruta
  const handlerNextRoute = () => {
    const index = rutas.findIndex((rutas) => rutas.orden === rutaSelect?.orden); //Index
    const lastElement = rutas.length - 1; //Último elemento

    //Validar que exista
    if (index === -1) return;

    // Validar que no sea el último elemento
    if (index === lastElement) {
      setMessage("No hay más rutas disponibles");
      return;
    }

    //Obtener el siguiente
    const nextRoute = rutas[index + 1];
    setRutaSelect(nextRoute);
    setValue("lecturaInicial", nextRoute.lectura);
    setValue("ordenLectura", nextRoute.orden.toString());
    setValue("numeroCuenta", nextRoute.cuenta);
  };

  const handleSave = async (data: LecturaFormInput) => {
    try {
      setIsLoading(true);
      const dataSend: LecturaT = {
        numeroCuenta: data.numeroCuenta,
        ruta: "2", //Por defecto
        ordenLectura: +data.ordenLectura,
        lecturaActual: +data.lecturaActual,
        consumo: +data.consumo,
        fecha: date.toString(),
        foto: photoGallery?.uri || "",
        observacion: observacion,
      };

      console.log("datos: ", dataSend);

      await LecturaController.addlectura(dataSend);
      Toast.show({
        type: "success",
        text1: "Ok",
        text2: "Se guardo la lectura",
      });

      reset(); //Resetear formulario
      setObservacion(""); //Resetear
      setPhotoGallery(undefined);
      setPhoto(undefined);
      handlerNextRoute(); //Lamar función para cargar la siguiente ruta
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
      const resultado = +lecturaActual - +lecturaInicial;
      setValue("consumo", resultado.toFixed(2));
    }
  }, [lecturaActual, lecturaInicial]);

  const sections = [
    <View key="section1" style={styles.form}>
      {/* Filtros en la parte superior de la sección 1 */}
      <View style={styles.filtersRow}>
        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Fecha de lectura:</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString('es-ES')}
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedRoute}
              onValueChange={handleRouteSelection}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar ruta" value="" />
              {routes.map((route, index) => (
                <Picker.Item key={index} label={route} value={route} />
              ))}
            </Picker>
          </View>
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
            <MessageAlert message={errors.ordenLectura.message} type="error" />
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
            <MessageAlert message={errors.numeroCuenta.message} type="error" />
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
            <MessageAlert message={errors.lecturaActual.message} type="error" />
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
            onPress={() => {
              setMessage('')
              navigation.goBack()
            }}
          >
            <Icon name="menu-open" size={30} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Título dinámico */}
        <Text style={styles.title}>
          {currentSection === 1 ? "    Detalles de la toma" : "Toma de lectura"}
        </Text>
      </View>

      {message && (
        <MessageAlert type="info" message={message} />
      )}

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

        {currentSection < sections.length - 1 && (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => setCurrentSection(currentSection + 1)}
          >
            <Text style={styles.arrowText}>DETALLES</Text>
            <Icon name="arrow-right" size={30} color="#fff" />
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
                <>
                  <Icon name="save" size={20} color="#fff" style={styles.iconButton}/>
                  <Text style={styles.arrowText}>GUARDAR</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
                  <Text style={styles.tableCell1}> {ruta.orden} </Text>
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
    padding: 16,
    backgroundColor: "#F9FAFB", // Color de fondo más suave
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 70,
    color: "#111827",
  },
  form: {
    marginTop: 10,
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputGroupRow: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputGroup: {
    marginBottom: 16,
    marginHorizontal: 6,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  greenInput: {
    borderWidth: 2,
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    padding: 12,
  },
  greenLabel: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    opacity: 0.7,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 5,
    padding: 10,  // Relleno para darle espacio interno
    borderWidth: 2, // Borde alrededor de los filtros
    borderColor: "#2563eb", // Color del borde
    borderRadius: 12, // Bordes redondeados
    backgroundColor: "#ffffff", // Fondo blanco
    elevation: 5,
  },
  filter: {
    flex: 1,
    marginRight: 8,
    borderColor: "#2563eb", // Contorno azul para destacar

  },
  filterLabel: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#374151",
    marginBottom: 5,
    flexDirection: "row",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    justifyContent: "center",
  },
  dateText: {
    marginRight: 25,
    fontSize: 15,
    color: "#374151",
  },
  pickerContainer: {
    borderWidth: 2, // Aplica el borde
    borderColor: "#d1d5db", // Color del borde
    borderRadius: 10, // Bordes redondeados
    marginTop: 8, // Separación superior
    height: 49, // Establece la altura
  },
  picker: {
    flex: 1, // Ocupa todo el espacio disponible
    height: "100%", // Asegura que el picker ocupe toda la altura disponible

  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  photoButton: {
    backgroundColor: "#1e293b",
    marginRight: 10,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  arrowButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  arrowText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  closeButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // un poco más oscuro para más contraste
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 35,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
    color: "#4b5563",
  },
  modalButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 16,
  },
  modalButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  table: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 10,
    width: "100%",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#d1d5db",
    paddingVertical: 14,
  },
  tableHeaderCell: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  firstHeaderCell: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  tableCell: {
    flex: 1.3,
    textAlign: "center",
    color: "#374151",
    fontSize: 13,
  },
  tableCell1: {
    flex: 0.9,
    textAlign: "center",
    color: "#374151",
    fontSize: 13,
  },
  optionButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  optionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  iconButton: {
    marginRight: 10, // Espaciado entre el ícono y el texto
  }
});


export default ReadingScreen;
