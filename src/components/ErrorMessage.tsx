import { View, StyleSheet, Text } from "react-native"

type ErrorMessageProps = {
    message: string
}   

export default function ErrorMessage({
    message
} : ErrorMessageProps) {
  return (
    <View  style={{
        marginTop: 5
    }} >
        <Text style={styles.message}> { message } </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    message: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 12,
        color: "#e7000b",
        backgroundColor: "#ffe2e2",
        padding: 7,
        borderRadius: 5
      },
})
