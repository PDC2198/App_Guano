import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraCapturedPicture } from "expo-camera";
import { Asset } from "expo-media-library";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MessageAlert from "../components/MessageAlert";
import Spinner from "../components/Spinner";
import TakePicture from "../components/TakePicture";
import { LecturaController } from "../controllers/LecturaController";
import { rutas } from "../data/rutas";
import {
  LecturaFormInput,
  LecturaRecord,
  LecturaT,
  RootStackParamList,
  Ruta,
} from "../types";
import ShowPicture from "./ShowPicture";

type AddEditFormReadingProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EditReading" | "Reading"
  >;
  lecturaDataEdit?: LecturaRecord;
};

export default function AddEditFormReading({
  navigation,
  lecturaDataEdit,
}: AddEditFormReadingProps) {

  const { width, height } = useWindowDimensions();
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
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  //Datos para editar la foto y moestrar en componente picture
  const [photoUriEdit, setPhotoUriEdit] = useState(""); //URI para almacenar la foto si lo trae la api
  const [isShowPictura, setIsShowPictura] = useState(false); //boolean para abrir/cerrar modal ShowPicture

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
    getValues
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
    const index = rutas.findIndex((rutas) => rutas.orden === rutaSelect?.orden);
    const lastElement = rutas.length - 1;

    if (index === -1) return;
    if (index === lastElement) {
      setMessage("No hay más rutas disponibles");
      return;
    }

    const nextRoute = rutas[index + 1];
    console.log("Siguiente ruta: ", nextRoute)
    // Actualizar todo en un batch
    setTimeout(() => {
      setRutaSelect(nextRoute);
      setValue("lecturaInicial", nextRoute.lectura, { shouldDirty: true });
      setValue("ordenLectura", nextRoute.orden.toString(), { shouldDirty: true });
      setValue("numeroCuenta", nextRoute.cuenta, { shouldDirty: true });
    }, 0);
  };

  console.log(getValues("ordenLectura"))

  const handleSave = async (data: LecturaFormInput) => {
    try {
      setIsLoading(true);

      let text1 = "";
      let text2 = "";

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

      //Editando
      if (lecturaDataEdit) {
        await LecturaController.updateLectura({
          ...dataSend,
          id: lecturaDataEdit.id,
        })
        text1 = "Ok";
        text2 = "Se edito correctamente la lectura";
      } else {
        await LecturaController.addlectura(dataSend);
        text1 = "Ok";
        text2 = "Se guardo la lectura";
        handlerNextRoute(); //Lamar función para cargar la siguiente ruta
      }

      Toast.show({
        type: "success",
        text1,
        text2,
      });

      reset(); //Resetear formulario
      setObservacion(""); //Resetear
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

  //Resetear photoUriEdit para tomar una nueva foto
  const resetUriPhoto = () => {
    if (setPhotoUriEdit) {
      setPhotoUriEdit('')
      setIsShowPictura(false) //cerrar modal
      setIsCameraVisible(true) //Abrir modal de la camara
    }
  }

  //UseEffect para calcular el consumo
  useEffect(() => {
    if (lecturaActual && lecturaInicial) {
      const resultado = +lecturaActual - +lecturaInicial;
      setValue("consumo", resultado.toFixed(2));
    }
  }, [lecturaActual, lecturaInicial]);

  //Llenar los datos al editar
  useEffect(() => {
    if (lecturaDataEdit) {
      setValue("numeroCuenta", lecturaDataEdit.numeroCuenta.toString());
      setValue("ruta", lecturaDataEdit.ruta);
      setValue("ordenLectura", lecturaDataEdit.ordenLectura.toString());
      setValue("lecturaActual", lecturaDataEdit.lecturaActual.toString());
      setValue("consumo", lecturaDataEdit.consumo.toString());
      setObservacion(observacion);
      setPhotoUriEdit(lecturaDataEdit.foto || "");
    }
  }, [lecturaDataEdit]);

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
    <>
      <View style={styles.topBar}>
        {currentSection === 0 && ( // Mostrar botón solo en la sección 1
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setMessage("");
              navigation.goBack();
            }}
          >
            <Icon name="menu-open" style={styles.menuButton} />
          </TouchableOpacity>
        )}
      </View>

      {message && <MessageAlert message={message} type="info" />}

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
            <Icon name="arrow-right-bold" size={30} color="#fff" />
          </TouchableOpacity>
        )}

        {currentSection === 0 && (
          <View style={styles.actionButtons}>
            {photoUriEdit ? (
              <TouchableOpacity
                style={[styles.photoButton, styles.arrowButton]}
                onPress={() => setIsShowPictura(true)}
              >
                <Icon
                  name="check"
                  size={20}
                  color="#fff"
                  style={styles.iconButton}
                />
                <Text style={styles.arrowText}>VER FOTO</Text>
                {photo && <Icon name="check" size={25} color={"white"} />}
              </TouchableOpacity>
            ) : (
              <TakePicture
                setPhotoGallery={setPhotoGallery}
                setPhoto={setPhoto}
                photo={photo}
                photoGallery={photoGallery}
                isCameraVisible={isCameraVisible}
                setIsCameraVisible={setIsCameraVisible}
              />
            )}

            <TouchableOpacity
              style={[styles.arrowButton, styles.saveButton]}
              onPress={handleSubmit(handleSave)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Icon
                    name="content-save"
                    size={20}
                    color="#fff"
                    style={styles.iconButton}
                  />
                  <Text style={styles.saveButton}>GUARDAR</Text>
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

      {
        photoUriEdit && (
          <ShowPicture
            uriPhoto={photoUriEdit}
            isShow={isShowPictura}
            closeModal={() => setIsShowPictura(false)}
            isEditOpen
            resetUriPhoto={resetUriPhoto}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 35,
    right: 10,

  },
  form: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 10,
  },
  inputGroupRow: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  greenInput: {
    borderWidth: 2,
    borderColor: "#16a34a",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
  },
  greenLabel: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#000",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
  },
  inputDisabled: {
    borderWidth: 1.5,
    borderColor: "#000",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    opacity: 0.6,
  },

  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,

    marginBottom: 24,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
    borderWidth: 1.2,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    gap: 14,
  },
  filter: {
    flex: 1,
  },
  filterLabel: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 6,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateText: {
    marginRight: 20,
    fontSize: 15,
    color: "#334155",
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    marginTop: 6,
    height: 50,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  picker: {
    flex: 1,
    height: "100%",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    padding: 15
  },
  photoButton: {
    backgroundColor: "#1e293b",
    borderRadius: 44,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 9,
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: 'center'
  },
  arrowButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  arrowText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginRight: 5,
  },
  closeButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 26,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
    color: "#475569",
  },
  modalButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginTop: 18,
  },
  modalButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  table: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 14,
  },
  tableHeaderCell: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  firstHeaderCell: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  tableCell: {
    flex: 1.3,
    textAlign: "center",
    color: "#1e293b",
    fontSize: 14,
  },
  tableCell1: {
    flex: 0.9,
    textAlign: "center",
    color: "#1e293b",
    fontSize: 14,
  },

  optionButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  optionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  iconButton: {
    marginRight: 0,
  },
  menuButton: {
    color: '#fff',
    fontSize: 30,

  }
});
