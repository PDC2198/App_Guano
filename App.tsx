import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ReadingScreen from "./src/screens/ReadingScreen";
import AboutScreen from "./src/screens/AboutScreen";
import SendScreen from "./src/screens/SendScreen";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "./src/types";
import EditReadingScreen from "./src/screens/EditReadingScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Reading" component={ReadingScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="EditReading" component={EditReadingScreen} />
      </Stack.Navigator>
      {/** Contendor del toast */}
      <Toast />
    </NavigationContainer>
  );
};

export default App;
