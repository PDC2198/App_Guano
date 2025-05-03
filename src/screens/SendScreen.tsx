import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  SafeAreaView,
  StatusBar
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ShowPicture from "../components/ShowPicture";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaRecord, Pagination, RootStackParamList } from "../types";
import { useIsFocused } from '@react-navigation/native';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const SendScreen = () => {

  const isFocused = useIsFocused();
  const [recordsPerPage, setRecordsPerPage] = useState(25); //Cantidad de páginas
  const [page, setPage] = useState(1); //Página actual escogida por el usuario

  const [statusFilter, setStatusFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [rutaFilter, setRutaFilter] = useState("todas");

  const [isShow, setIsShow] = useState(false); //Boolean Modal
  const [uriPhoto, setUriPhoto] = useState("");

  const [lecturas, setLecturas] = useState<LecturaRecord[]>([]);

  const [pagination, setPagination] = useState<Pagination>();
  const navigation = useNavigation<Navigation>();

  //Obtener lecturas de la DB
  const getLecturas = async () => {
    try {
      //Definir el estado
      let estado: boolean | undefined = false;

      if (statusFilter === "todos") {
        estado = undefined;
      } else {
        estado = statusFilter === "enviado" ? true : false;
      }

      //Funcionar la ruta
      const ruta = rutaFilter === "todas" ? undefined : rutaFilter;

      const response = await LecturaController.getAllLectura({
        ruta,
        estado,
        page: page,
        pageSize: recordsPerPage,
      });

      setLecturas(response.lecturas);
      setPagination(response.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  // Controlar next/previous
  const nextOfPrevious = (type: "next" | "previous") => {
    if (!pagination) return;
    const { currentPage, totalPages } = pagination;

    if (type === "next") {
      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      }
    } else if (type === "previous") {
      if (currentPage > 1) {
        setPage(currentPage - 1);
      }
    }
  };

  //Abrir modal
  const openModal = (uri: LecturaRecord["foto"]) => {
    if (!uri) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Imagen no disponible.",
      });
      return;
    }

    setIsShow(true);
    setUriPhoto(uri);
  };

  //Cerrar modal y restaurar uri
  const closeModal = () => {
    setIsShow(false);
    setUriPhoto("");
  };

  //Eliminar registro
  const deleteLectura = async (id: LecturaRecord["id"]) => {
    try {
      Alert.alert(
        "Confirmar acción",
        "¿Estás seguro que quieres eliminar el registro?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancelado"),
            style: "cancel",
          },
          {
            text: "Aceptar",
            onPress: async () => {
              try {
                await LecturaController.delete(id);
                Toast.show({
                  type: "success",
                  text1: "Ok",
                  text2: "Lectura eliminada correctamente",
                });
                getLecturas();
              } catch (error) {
                console.log(error);
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: `Error en DB: ${error}`,
                });
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLecturas();
  }, [statusFilter, rutaFilter, recordsPerPage, page, isFocused]);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ImageBackground
          source={require('../assets/fondoX.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Botón de retroceso */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="menu-open" size={30} color='#fff' />
            </TouchableOpacity>
            {/* Título centrado */}
            <Text style={styles.headerTitle}>Sincronización</Text>
          </View>

          <View
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonExport}
              onPress={() => LecturaController.exportDatabase()}
            >
              <Text style={styles.textExport}>Exportar DB</Text>
              <Icon name="download" size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Contenedor principal */}
          <View style={styles.contentContainer}>
            {/* Filtros */}
            <View style={styles.filtersContainer}>
              {/* Filtro de RUTA */}
              <Text style={styles.filterLabel}>RUTA:</Text>
              <Picker
                selectedValue={rutaFilter}
                style={styles.picker}
                onValueChange={(itemValue) => setRutaFilter(itemValue)}
              >
                <Picker.Item label="Todas" value="todas" />
                <Picker.Item label="Ruta 1" value="1" />
                <Picker.Item label="Ruta 2" value="2" />
              </Picker>

              {/* Filtro de PERIODO DE LECTURA */}
              <Text style={styles.filterLabel}>PERIODO DE LECTURA:</Text>
              <Picker
                selectedValue={periodoFilter}
                style={styles.picker}
                onValueChange={(itemValue) => setPeriodoFilter(itemValue)}
              >
                <Picker.Item label="Todos" value="todos" />
                <Picker.Item label="Enero 2025" value="enero_2025" />
                <Picker.Item label="Febrero 2025" value="febrero_2025" />
              </Picker>

              {/* Filtro de ESTADO */}
              <Text style={styles.filterLabel}>ESTADO:</Text>
              <Picker
                selectedValue={statusFilter}
                style={styles.picker}
                onValueChange={(itemValue) => setStatusFilter(itemValue)}
              >
                <Picker.Item label="Todos" value="todos" />
                <Picker.Item label="Enviado" value="enviado" />
                <Picker.Item label="No Enviado" value="no_enviado" />
              </Picker>
            </View>
            {/* Tabla */}
            <View style={styles.tableContainer}>
              <FlatList
                data={lecturas}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, styles.columnSmall]}>
                      ORDEN
                    </Text>
                    <Text style={styles.headerCell}>NÚMERO DE CUENTA</Text>
                    <Text style={styles.headerCell}>LECTURA (m³)</Text>
                    <Text style={styles.headerCell}>CONSUMO (m³)</Text>
                    <Text style={[styles.headerCell, styles.columnSmall]}>
                      FOTO
                    </Text>
                    <Text
                      style={[
                        styles.headerCell,
                        styles.columnSmall,
                        styles.lastCell,
                      ]}
                    >
                      ACCIÓN
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.cell, styles.columnSmall]}>
                      {item.id}
                    </Text>
                    <Text style={styles.cell}>{item.numeroCuenta}</Text>
                    <Text style={styles.cell}>{item.lecturaActual}</Text>
                    <Text style={styles.cell}>{item.consumo}</Text>

                    {/* FOTO */}
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={() => openModal(item.foto)}
                    >
                      <Text style={styles.photoText}>
                        {item.foto ? (
                          "📷"
                        ) : (
                          <Icon name="image-off" size={15} color={"white"} />
                        )}
                      </Text>
                    </TouchableOpacity>

                    {/* ACCIÓN */}
                    <View
                      style={[
                        styles.cell,
                        styles.columnSmall,
                        styles.actionContainer,
                      ]}
                    >
                      {!item.estado && (
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() =>
                            navigation.navigate("EditReading", {
                              id: item.id.toString(),
                            })
                          }
                        >
                          <Icon name="pencil" size={15} color="#ffffff" />
                        </TouchableOpacity>
                      )}

                      {!item.estado && (
                        <TouchableOpacity
                          style={[styles.iconButton, styles.deleteButton]}
                          onPress={() => deleteLectura(item.id)}
                        >
                          <Icon name="trash-can" size={15} color="#ffffff" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />
            </View>
            {/* Pie de tabla */}
            <View style={styles.footerContainer}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.selectedText}>{recordsPerPage}</Text>
                <Picker
                  selectedValue={recordsPerPage}
                  onValueChange={(itemValue) => setRecordsPerPage(itemValue)}
                  mode="dropdown"
                  style={styles.footerPicker}
                >
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="25" value={25} />
                  <Picker.Item label="50" value={50} />
                  <Picker.Item label="75" value={75} />
                  <Picker.Item label="100" value={100} />
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => setPage(1)}
              >
                <Text style={styles.paginationText}>⏮</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => nextOfPrevious("previous")}
              >
                <Text style={styles.paginationText}>◀</Text>
              </TouchableOpacity>

              <Text style={styles.paginationText}>
                ( {`${pagination?.currentPage} de ${pagination?.totalPages}`} )
              </Text>

              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => nextOfPrevious("next")}
              >
                <Text style={styles.paginationText}>▶</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => setPage(pagination?.totalPages || 1)}
              >
                <Text style={styles.paginationText}>⏭</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                marginTop: 10,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                Total de registros:{" "}
              </Text>
              <Text
                style={{
                  color: "#000",
                }}
              >
                {pagination?.totalItems}
              </Text>
            </View>

          </View>
          {/* Botón ENVIAR */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => alert("Datos enviados con éxito")}
            >
              <Text style={styles.sendButtonText}>ENVIAR</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>

      <ShowPicture
        uriPhoto={uriPhoto}
        isShow={isShow}
        closeModal={closeModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Botón de retroceso
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: "#1D4ED8",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  backButtonText: {
    fontSize: 20,
    color: "#ffffff",
  },
  // Encabezado
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  // Filtros
  filtersContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  picker: {
    height: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  // Tabla
  tableContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
    borderRightWidth: 2,
    borderRightColor: "#60a5fa",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  columnSmall: {
    flex: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#111827",
    textAlignVertical: 'center',
    alignItems: 'center'
  },
  // Botones
  photoButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginRight: 8,
  },
  photoText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    width: "50%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Pie de tabla
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D4ED8",
    paddingVertical: 8,
    borderRadius: 8,
  },
  footerPicker: {
    flex: 1,
    height: "100%",
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 8,
  },
  paginationText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#1D4ED8",
    width: 80,
    height: 30,
    paddingHorizontal: 5,
  },
  selectedText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    marginRight: 6,
  },
  // Exportar botón
  buttonExport: {
    paddingVertical: 8,
    backgroundColor: "#64748b",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    alignSelf: "center",
  },
  textExport: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Contenedor de acciones
  actionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  iconButton: {
    backgroundColor: "#3B82F6",
    padding: 5,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
});

export default SendScreen;
