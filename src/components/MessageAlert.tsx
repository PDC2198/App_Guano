import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type MessageAlertprops = {
  message: string;
  type: "info" | "error";
};

export default function MessageAlert({ message, type }: MessageAlertprops) {

  return (
    <View
      style={[
        styles.messageContainer,
        type === "error" ? styles.errorColor : "",
        type === "info" ? styles.infoColor : ""
      ]}
    > 
      { type === "info" && (
        <Icon name="information-outline" size={30} color="#155dfc"  />
      )}

      <Text style={[
        type === "error" ? styles.textError : "",
        type === "info" ? styles.textInfo : ""
      ]}> {message} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12,
    padding: 7,
    borderRadius: 5,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "5"
  },
  errorColor : {
    backgroundColor: "#ffe2e2",
  },
  textError : {
    color: "#e7000b",
  },
  infoColor: {
    backgroundColor: "#dbeafe"
  },
  textInfo: {
    color: "#155dfc"
  }

});
