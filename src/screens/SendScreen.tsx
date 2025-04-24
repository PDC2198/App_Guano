import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LecturaController } from "../controllers/LecturaController";
import { LecturaRecord, ParamsLectura } from "../types";
import ShowPicture from "../components/ShowPicture";
import Toast from "react-native-toast-message";

const SendScreen = () => {
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [rutaFilter, setRutaFilter] = useState("todas");

  const [isShow, setIsShow] = useState(false); //Boolean Modal
  const [uriPhoto, setUriPhoto] = useState("");

  const [lecturas, setLecturas] = useState<LecturaRecord[]>([]);

  const navigation = useNavigation();

  //Obtener lecturas de la DB
  const getLecturas = async (params: ParamsLectura) => {
    try {
      const response = await LecturaController.getAllLectura(params);
      console.log(response);
      setLecturas(response);
    } catch (error) {
      console.log(error);
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


  useEffect(() => {
    getLecturas({})
  }, []);

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

        <View style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <TouchableOpacity 
            style={styles.buttonExport}
            onPress={() => LecturaController.exportDatabase()}
          >
            <Text style={styles.textExport}>Exportar DB</Text>
             <Icon name="download" size={20} color="#fff" />
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
                  <Text style={styles.headerCell}>OBSERVACIÓN</Text>
                  <Text
                    style={[
                      styles.headerCell,
                      styles.columnSmall,
                      styles.lastCell,
                    ]}
                  >
                    FOTO
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
                  <Text style={styles.cell}>{item.observacion}</Text>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => openModal(item.foto)}
                  >
                    <Text style={styles.photoText}>
                      {" "}
                      {item.foto ? (
                        "📷"
                      ) : (
                        <Icon name="image-off" size={15} color={"white"} />
                      )}{" "}
                    </Text>
                  </TouchableOpacity>
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
                <Picker.Item label="25" value={25} />
                <Picker.Item label="50" value={50} />
                <Picker.Item label="75" value={75} />
                <Picker.Item label="100" value={100} />
              </Picker>
            </View>

            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>⏮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>◀</Text>
            </TouchableOpacity>

            <Text style={styles.paginationText}>( 1 de 1 )</Text>

            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>⏭</Text>
            </TouchableOpacity>
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
  buttonExport : {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#62748e",
    width: "50%",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  textExport: {
    textAlign: "center",
    color: "#FFFFFF"
  }
});

export default SendScreen;
