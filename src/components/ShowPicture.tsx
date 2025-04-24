import { Image, View, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type ShowPictureProps = {
  uriPhoto: string;
  isShow: boolean;
  closeModal: () => void;
};

export default function ShowPicture({
  uriPhoto,
  isShow,
  closeModal,
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
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => closeModal()}
        >
          <Icon name="close" size={30} color={"white"} />
        </TouchableOpacity>
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
});
