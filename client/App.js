import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProvider from "./context/UserContext";

import Auth from "./Auth";
import Home from "./Home";
import Secret from "./Secret";

//executes connection to Firebase
import "./firebase.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
            component={Auth}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Secret" component={Secret} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
