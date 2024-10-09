import React, { useEffect } from "react";
import { View, Image, Text, StatusBar } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "./components/Home";
import Login from "./screens/Login";
import Dashboard from "./screens/Superadmin/Dashboard";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
import { drawerStyle, defaultImg, divider, colors } from "./styles/Styles";
import DonorRecords from "./screens/Superadmin/DonorRecords";
import RecipientRecords from "./screens/Superadmin/RecipientRecords";
import Schedule from "./screens/Superadmin/Schedule";
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyle.profileContainer}>
        <Image
          source={{ uri: defaultImg }} // Replace with your profile picture URL
          style={drawerStyle.profilePic}
        />
        <Text style={drawerStyle.profileName}>John Doe</Text>
      </View>

      <View style={divider.divider} />
      <DrawerItem
        label="Home"
        icon={({ focused, color, size }) => (
          <Icon name="home" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 0}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('home')} />

      <DrawerItem
        label="My Profile"
        icon={({ focused, color, size }) => (
          <Icon name="account-circle" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 1}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('My Profile')} />

      <DrawerItem
        label="Settings"
        icon={({ focused, color, size }) => (
          <Icon name="cog" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 2}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('My Profile')} />

      <DrawerItem
        label="Help & Support"
        icon={({ focused, color, size }) => (
          <Icon name="phone" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 3}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('My Profile')} />

      <DrawerItem
        label="About Us"
        icon={({ focused, color, size }) => (
          <Icon name="information" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 4}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('My Profile')} />
      {/* <DrawerItemList {...props} /> */}
    </DrawerContentScrollView>
  );
};
const MainStack = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRoute = e.data.state.routes[e.data.state.index].name;
      if (currentRoute === 'login') {
        navigation.getParent()?.setOptions({ swipeEnabled: false });
      }
      else {
        navigation.getParent()?.setOptions({ swipeEnabled: true });
      }
    })
    return unsubscribe;
  }, [navigation])
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="superadmin_dashboard" component={Dashboard} />
        <Stack.Screen name="superadmin_donor_record" component={DonorRecords}/>
        <Stack.Screen name="superadmin_recipient_record" component={RecipientRecords}/>
        <Stack.Screen name="superadmin_schedules" component={Schedule}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}
const Main = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={drawerStyle.container}>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Drawer.Screen name="Home" component={MainStack} options={{ swipeEnabled: false }} />
          <Drawer.Screen name="My Profile" component={Dashboard} />

        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default Main