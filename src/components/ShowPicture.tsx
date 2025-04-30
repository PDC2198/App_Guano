import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type ShowPictureProps = {
  uriPhoto: string;
  isShow: boolean;
  closeModal: () => void;
  isEditOpen?: boolean; //boolean para saber si se abrio en pantalla de edición
  resetUriPhoto?: () => void;
};

export default function ShowPicture({
  uriPhoto,
  isShow,
  closeModal,
  isEditOpen,
  resetUriPhoto,
}: ShowPictureProps) {
  return (
    <Modal visible={isShow} transparent={false} animationType="slide">
      <View style={styles.fullScreenContainer}>
        <Image
          source={{ uri: uriPhoto }}
          style={styles.photoImage}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => closeModal()}
          >
            <Icon name="close" size={30} color={"white"} />
          </TouchableOpacity>

          {isEditOpen && resetUriPhoto && (
            <TouchableOpacity onPress={() => resetUriPhoto()}>
              <Icon
                name="delete"
                size={30}
                color={"#c10007"}
                style={styles.trashButton}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  photoPreview: {
    margin: 20,
    alignItems: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  trashButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
});
