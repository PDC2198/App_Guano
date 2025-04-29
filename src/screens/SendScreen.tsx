import { Picker } from "@react-native-picker/picker";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ShowPicture from "../components/ShowPicture";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaRecord, Pagination, RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const SendScreen = () => {
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
        text2: "No hay foto para mostrar",
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
                console.log(error)
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: `Error en db: ${error}`,
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
  }, [statusFilter, rutaFilter, recordsPerPage, page]);

  return (
    <>
      <View style={styles.container}>
        {/* Botón de retroceso */}
        <View style={styles.headerContainer}>
          {/* Botón de retroceso */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="menu-open" size={30} color="#fff" />
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
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => navigation.navigate('EditReading', {id: item.id.toString()})}
                    >
                      <Icon name="pencil" size={15} color="#ffffff" />
                    </TouchableOpacity>

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
              justifyContent: "flex-start",
              gap: 5,
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#155dfc",
              }}
            >
              Total de registros:{" "}
            </Text>
            <Text
              style={{
                color: "#155dfc",
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
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => alert("Datos enviados con éxito")}
          >
            <Text style={styles.sendButtonText}>ENVIAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ShowPicture
        uriPhoto={uriPhoto}
        isShow={isShow}
        closeModal={closeModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 80, // Espacio para evitar solapamiento con el botón de retroceso
  },

  // Botón de retroceso
  backButton: {
    position: "absolute",
    left: 15,
    backgroundColor: "#007BFF",
    padding: 6,
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  backButtonText: {
    fontSize: 22,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  // Estilos de los filtros
  filtersContainer: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10, // Sombra en Android
    marginBottom: 7,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
  },

  // Tabla
  tableContainer: {
    flex: 0.9,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },

  // Cabecera de la tabla
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 10,
    borderRightWidth: 1, // Línea separadora entre columnas
    borderRightColor: "#ccc",
  },
  lastCell: {
    borderRightWidth: 0, // Evita la línea en la última columna
  },
  columnSmall: {
    flex: 0.6,
  },

  // Filas de la tabla
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#333",
  },

  // Botón de foto
  photoButton: {
    flex: 0.2,
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    justifyContent: "center",
    alignContent: "flex-start",
    height: 45,
  },
  photoText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Botón ENVIAR
  sendButton: {
    backgroundColor: "#28a745",
    padding: 10,
    marginTop: -30, // Separación respecto a la tabla
    marginBottom: 50, // Reducimos el espacio inferior
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    width: "50%",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  //PIE DE TABLA
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    borderRadius: 8,
  },

  footerPicker: {
    flex: 1,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    width: "100%",
    height: "100%",
    color: "#000",
  },

  paginationButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
  },

  paginationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#007BFF",
    width: 75, // Ajustado para mejor visibilidad
    height: 25,
  },
  selectedText: {
    fontSize: 15,
    marginRight: 5,
    marginLeft: 10, // Espacio antes de la flecha
    color: "#fff",
    fontWeight: "bold",
  },
  buttonExport: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#62748e",
    width: "50%",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textExport: {
    textAlign: "center",
    color: "#FFFFFF",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6, // espacio entre íconos
  },

  iconButton: {
    backgroundColor: "#3B82F6",
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 2,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
  },
});

export default SendScreen;
