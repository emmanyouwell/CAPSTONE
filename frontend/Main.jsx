import React, {useState, useEffect, startTransition } from "react";
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
import Metrics from "./screens/Superadmin/Metrics";

import { getUser } from "./utils/helper";
import AccountManagement from "./screens/Superadmin/AccountManagement";
import CreateAdmin from "./components/Superadmin/Accounts/CreateAdmin";
import CreateStaff from "./components/Superadmin/Accounts/CreateStaff";

//Inventory Screens
import Inventory from "./screens/Superadmin/Inventory";
import Fridges from "./screens/Superadmin/Inventories/Refrigerator";
import InventoryCards from "./components/Superadmin/Inventories/Refrigerators/InventoryCard"
import PasteurCards from "./components/Superadmin/Inventories/Refrigerators/PasteurCards"
import FridgeDetails from "./components/Superadmin/Inventories/Refrigerators/FridgeDetails";
import AddFridge from "./components/Superadmin/Inventories/Refrigerators/AddFridge";
import EditFridge from "./components/Superadmin/Inventories/Refrigerators/EditFridge";
import AddMilkInventory from "./components/Superadmin/Inventories/Refrigerators/AddMilkInventory";
import EditMilkInventory from "./components/Superadmin/Inventories/Refrigerators/EditMilkInventory";

import MilkLetting from "./screens/Superadmin/Inventories/MilkLetting";

import Equipment from "./screens/Superadmin/Inventories/Equipment";
import AddEquipment from "./components/Superadmin/Inventories/Equipment/AddEquipment";
import EditEquipment from "./components/Superadmin/Inventories/Equipment/EditEquipment";

//Request Screens
import MilkRequest from "./components/Superadmin/Requests/MilkRequest";
import ConfirmRequest from "./components/Superadmin/Requests/ConfirmRequest";
import AddPatient from "./screens/Staff/AddPatient";
import AddRequest from "./screens/Staff/AddRequest";
import Articles from "./screens/Superadmin/Articles";
import AddArticles from "./components/Superadmin/Articles/AddArticles";
import EditRequest from "./components/Superadmin/Requests/EditRequest";

//Charts Screens
import MilkPerMonth from "./components/Superadmin/Metrics/MilkPerMonth";
import DonorsPerMonth from "./components/Superadmin/Metrics/DonorsPerMonth";

import TestNotif from "./components/Superadmin/Metrics/TestNotif";
import EditEvent from "./components/Superadmin/Schedule/EditEvent";
import AddEvent from "./components/Superadmin/Schedule/AddEvent";

const CustomDrawerContent = (props) => {

  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    startTransition(() => {
      const fetchUserDetails = async () => {
        const user = await getUser();
        setUserDetails(user);
      };
      fetchUserDetails();
    });
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyle.profileContainer}>
        {/* <Image
          source={{ uri: defaultImg }} // Replace with your profile picture URL
          style={drawerStyle.profilePic}
        /> */}
        <Text style={drawerStyle.profileName}>{userDetails
            ? `Logged in as, ${userDetails.name}`
            : "Logged in as, Superadmin"}</Text>
      </View>

      <View style={divider.divider} />
      {/* <DrawerItem
        label="Home"
        icon={({ focused, color, size }) => (
          <Icon name="home" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 0}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('home')} /> */}

      <DrawerItem
        label="Dashboard"
        icon={({ focused, color, size }) => (
          <Icon name="account-circle" color={focused ? 'white' : colors.color2} size={26} />
        )}
        focused={props.state.index === 1}
        activeTintColor="white"
        inactiveTintColor="black"
        activeBackgroundColor={colors.color1}
        onPress={() => props.navigation.navigate('Dashboard')} />

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
        {/* Superadmin navigations */}
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="superadmin_dashboard" component={Dashboard} />
        <Stack.Screen name="superadmin_donor_record" component={DonorRecords}/>
        <Stack.Screen name="superadmin_recipient_record" component={RecipientRecords}/>
        <Stack.Screen name="superadmin_schedules" component={Schedule}/>
        <Stack.Screen name="superadmin_metrics" component={Metrics}/>
        <Stack.Screen name="superadmin_account_management" component={AccountManagement}/>
        <Stack.Screen name="superadmin_account_create_admin" component={CreateAdmin}/>
        <Stack.Screen name="superadmin_account_create_staff" component={CreateStaff}/>
        
        {/* Schedule */}
        <Stack.Screen name="editEvents" component={EditEvent}/>
        <Stack.Screen name="addEvents" component={AddEvent}/>

        {/* Articles */}
        <Stack.Screen name="superadmin_articles"
        component={Articles}/>
        <Stack.Screen name="add_articles" component={AddArticles}/>


      {/* {Fridge Inventory Navigation} */}
        <Stack.Screen name="superadmin_inventories" component={Inventory}/>
        <Stack.Screen name="superadmin_fridges" component={Fridges}/>
        <Stack.Screen name="InventoryCards" component={InventoryCards}/>
        <Stack.Screen name="PasteurCards" component={PasteurCards}/>
        <Stack.Screen name="FridgeDetails" component={FridgeDetails}/>
        <Stack.Screen name="AddFridge" component={AddFridge}/>
        <Stack.Screen name="EditFridge" component={EditFridge}/>
        <Stack.Screen name="AddMilkInventory" component={AddMilkInventory}/>
        <Stack.Screen name="EditMilkInventory" component={EditMilkInventory}/>
        
        <Stack.Screen name="superadmin_milkLetting" component={MilkLetting}/>

        <Stack.Screen name="superadmin_equipment" component={Equipment}/>
        <Stack.Screen name="AddEquipment" component={AddEquipment}/>
        <Stack.Screen name="EditEquipment" component={EditEquipment}/>

      {/* {Request Admins Navigation} */}
        <Stack.Screen name="MilkRequest" component={MilkRequest}/>
        <Stack.Screen name="ConfirmRequest" component={ConfirmRequest}/>
        <Stack.Screen name="EditRequest" component={EditRequest}/>
      {/* {Request Staff Navigation} */}
        <Stack.Screen name="AddPatient" component={AddPatient}/>
        <Stack.Screen name="AddRequest" component={AddRequest}/>

      {/* {Charts Navigation} */}
        <Stack.Screen name="MilkPerMonth" component={MilkPerMonth}/>
        <Stack.Screen name="DonorsPerMonth" component={DonorsPerMonth}/>
        <Stack.Screen name="TestNotif" component={TestNotif}/>

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
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Home" component={MainStack} options={{ swipeEnabled: false }} />
          <Drawer.Screen name="Dashboard" component={Dashboard} />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};



export default Main