import {  View, ActivityIndicator, StyleSheet } from 'react-native'

export default function Spinner() {
  return (
    <View style={style.container}>
        <ActivityIndicator size={'large'}  color={'#FFFFFF'} />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
