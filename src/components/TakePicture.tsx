import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

type TakePictureProps = {
  setPhoto: Dispatch<SetStateAction<CameraCapturedPicture | undefined>>
  photo: CameraCapturedPicture | undefined
  setPhotoGallery: React.Dispatch<React.SetStateAction<MediaLibrary.Asset | undefined>>
  photoGallery: MediaLibrary.Asset | undefined
}

export default function TakePicture({
  setPhotoGallery,
  photo,
  setPhoto,
  photoGallery,
  
}: TakePictureProps) {
  //Permisos
  const [permission, requestPermission] = useCameraPermissions(); //Camara
  const [galleryPermission, requestGalleryPermission] =
    MediaLibrary.usePermissions(); //Galería

  const [facing, setFacing] = useState<CameraType>("back");
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          Activa el permiso para usar la cámara
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  //Tomar foto y guardar en galería
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Verifica permiso antes de guardar
        if (!galleryPermission?.granted) {
          const { granted } = await requestGalleryPermission();
          if (!granted) {
            Alert.alert(
              "Permiso denegado",
              "No se puede guardar la foto sin permiso a la galería."
            );
            return;
          }
        }

        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo);

        // Guarda la imagen en la galería
        const media = await MediaLibrary.createAssetAsync(photo!.uri);
        setPhotoGallery(media)
      } catch (error) {
        console.error("Error al tomar la foto:", error);
        Alert.alert("Error", "No se pudo tomar la foto.");
      }
    }
  };

  //Eliminar foto
  const deleteSavedPhoto = async () => {
    if (!photoGallery) {
      Alert.alert("Error", "No hay ninguna foto guardada para borrar.");
      return;
    }

    try {
      const deleted = await MediaLibrary.deleteAssetsAsync([photoGallery.id]);
      if (deleted) {
        Alert.alert("Éxito", "La foto ha sido eliminada de la galería.");
        setPhoto(undefined);
        setPhotoGallery(undefined)
      }
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar eliminar la foto.");
    }
  };

  return (
    <>
      {/* Botón para abrir la cámara */}
      <TouchableOpacity
        style={[styles.photoButton, styles.arrowButton ]}
        onPress={() => setIsCameraVisible(true)}
      >
        <Icon name="add-a-photo" size={20} color="#fff" style={styles.iconButton}/>
        <Text style={styles.arrowText}>TOMAR FOTO</Text> 
        {
          photoGallery && (
            <Icon name="check" size={25} color={"white"} />
          )
        }

      </TouchableOpacity>

      {/* Modal con la cámara full screen */}
      <Modal
        visible={isCameraVisible}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.fullScreenContainer}>
  
          {!photo ? (
            <CameraView
              ref={cameraRef}
              facing={facing}
              style={styles.fullScreenCamera}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                >
                  <Icon name="flip-camera-android" size={40} color={"white"} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={[styles.photoPreview, styles.fullScreenCamera]}>
              {/* Vista previa de la foto */}
              <Image
                source={{ uri: photo.uri }}
                style={styles.photoImage}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={{
            position: "absolute",
            top: 0,
            width: "100%"
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: "flex-end"
            }}>
              <TouchableOpacity

                onPress={() => deleteSavedPhoto()}
              >
                 <Icon name="delete" size={30} color={"#c10007"} style={styles.trashButton}/>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsCameraVisible(false)}
              >
                <Icon name="cancel" size={30} color={"white"}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Estilos para el botón de abrir cámara
  takePhotoButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 20,
    color: "#FFFFFF",
  },
  icon: {
    marginLeft: 8, // Espaciado entre el ícono y el texto
  },
  arrowButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  photoButton: {
    backgroundColor: "#34495e",
    marginRight: 10,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  arrowText: {
    color: "#fff",
    fontWeight: "bold",
    
  },

  // Estilos para la cámara full screen
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  fullScreenCamera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cameraControls: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flipButton: {
    padding: 10,
  },
  flipText: {
    color: "white",
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  trashButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },

  // Estilos para permisos
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12,
    color: "#e7000b",
    backgroundColor: "#ffe2e2",
    padding: 10,
    borderRadius: 5
  },
  permissionButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "100%"
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16
  },

  // Estilos para vista previa de foto
  photoPreview: {
    margin: 20,
    alignItems: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  iconButton: {
    marginRight: 10, // Espaciado entre el ícono y el texto
  }
});
