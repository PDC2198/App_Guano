import { useState, useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Modal, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from "expo-camera";

export default function TakePicture() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Activa el permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo);
        setIsCameraVisible(false); // Cierra la cámara después de tomar la foto
      } catch (error) {
        console.error("Error al tomar la foto:", error);
      }
    }
  };

  return (
    <>
      {/* Botón para abrir la cámara */}
      <TouchableOpacity 
        style={styles.takePhotoButton} 
        onPress={() => setIsCameraVisible(true)}
      >
        <Text style={styles.takePhotoButtonText}>TOMAR FOTO</Text>
      </TouchableOpacity>

      {/* Modal con la cámara full screen */}
      <Modal
        visible={isCameraVisible}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.fullScreenContainer}>
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
                <Text style={styles.flipText}>Flip Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </CameraView>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setIsCameraVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Vista previa de la foto */}
      {photo && (
        <View style={styles.photoPreview}>
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.photoImage}
            resizeMode="contain"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Estilos para el botón de abrir cámara
  takePhotoButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  takePhotoButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Estilos para la cámara full screen
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenCamera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraControls: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    padding: 10,
  },
  flipText: {
    color: 'white',
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Estilos para permisos
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Estilos para vista previa de foto
  photoPreview: {
    margin: 20,
    alignItems: 'center',
  },
  photoImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});