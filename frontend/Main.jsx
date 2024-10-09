import React, { useEffect } from "react";
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from "@react-navigation/drawer";
  import { NavigationContainer } from "@react-navigation/native";
  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import { createDrawerNavigator } from "@react-navigation/drawer";
  import { Ionicons } from "@expo/vector-icons"
  import Home from "./components/Home";
  import Login from "./screens/Login";
import Dashboard from "./screens/Superadmin/Dashboard";
  const Stack = createNativeStackNavigator();
const Main = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Group>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="superadmin_dashboard" component={Dashboard}/>
          </Stack.Group>
        </Stack.Navigator>
        </NavigationContainer>
      );
}

export default Main