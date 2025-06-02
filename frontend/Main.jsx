import React, { useState, useEffect, startTransition } from "react";
import { View, Image, Text, StatusBar, StyleSheet } from "react-native";
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
import Home from "./screens/Users/Home";
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
import BagCards from "./components/Superadmin/Inventories/Refrigerators/BagCards";
import ConfirmBottleReserve from "./components/Superadmin/Inventories/Refrigerators/ConfirmBottleReserve";
import StoreCollections from "./components/Superadmin/Inventories/Refrigerators/StoreCollections";

// Milk Letting Screens
import MilkLetting from "./screens/Superadmin/MilkLetting";
import AddMilkLetting from "./components/Superadmin/MilkLetting/AddMilkLetting";
import Attendance from "./components/Superadmin/MilkLetting/Attendance";
import FinalizeLetting from "./components/Superadmin/MilkLetting/FinalizeLetting";
import EditMilkLetting from "./components/Superadmin/MilkLetting/EditMilkLetting";
import HistoryLetting from "./components/Superadmin/MilkLetting/HistoryLetting";
import MilkLettingDetails from "./components/Superadmin/MilkLetting/MilkLettingDetails";

import Equipment from "./screens/Superadmin/Inventories/Equipment";
import AddEquipment from "./components/Superadmin/Inventories/Equipment/AddEquipment";
import EditEquipment from "./components/Superadmin/Inventories/Equipment/EditEquipment";

//Request Screens
import RequestOpt from "./screens/Superadmin/RequestOpt";
import RefRequest from "./screens/Superadmin/Inventories/RefRequest";
import Inpatients from "./components/Superadmin/Requests/Inpatients";
import Outpatients from "./components/Superadmin/Requests/Outpatients";
import ConfirmRequest from "./components/Superadmin/Requests/ConfirmRequest";
import RequestDetails from "./screens/Staff/RequestDetails";
import AddPatient from "./screens/Staff/AddPatient";
import AddRequest from "./screens/Staff/AddRequest";
import Requested from "./screens/Staff/Requested";
import EditRequest from "./components/Superadmin/Requests/EditRequest";
import EditStaffRequest from "./components/Staff/EditStaffRequest";

// Articles
import Articles from "./screens/Superadmin/Articles";
import AddArticles from "./components/Superadmin/Articles/AddArticles";

// Schedules
import EditSchedule from "./components/Superadmin/Schedule/EditSchedule";
import HistorySchedules from "./components/Superadmin/Schedule/HistorySchedules";

//Charts Screens
import MilkPerMonth from "./components/Superadmin/Metrics/MilkPerMonth";
import DonorsPerMonth from "./components/Superadmin/Metrics/DonorsPerMonth";
import DispensedPerMonth from "./components/Superadmin/Metrics/DispensedPerMonth";
import PatientsPerMonth from "./components/Superadmin/Metrics/PatientsPerMonth";
import RequestsPerMonth from "./components/Superadmin/Metrics/RequestsPerMonth";

import EditEvent from "./components/Superadmin/Schedule/EditEvent";
import AddEvent from "./components/Superadmin/Schedule/AddEvent";
import EditArticles from "./components/Superadmin/Articles/EditArticles";
import EmployeeLogin from "./screens/EmployeeLogin";
import CreateBag from "./screens/Users/Bags/CreateBag";
import EditBag from "./screens/Users/Bags/EditBag";
import { useDispatch, useSelector } from 'react-redux';
import { getDonorSchedules } from "./redux/actions/scheduleActions";
import PickUpSchedules from "./screens/Users/Schedule/PickUpSchedules";
import { getUserDetails } from "./redux/actions/userActions";
const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const { schedules, count, loading, error } = useSelector((state) => state.schedules);
  const currentRoute = props.state?.routes[props.state.index]?.name;

  const { userDetails } = useSelector((state) => state.users);


  useEffect(() => {
    dispatch(getUserDetails())
  }, [dispatch])
  useEffect(() => {
    if (userDetails && userDetails.role === 'User') {
      dispatch(getDonorSchedules(userDetails._id));
      console.log('User Details:', userDetails);
    }

  }, [dispatch, userDetails]);
  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyle.profileContainer}>

        <Text style={drawerStyle.profileName}>Logged in as,</Text>
        <Text style={drawerStyle.profileName}>{userDetails && userDetails.name
          ? `${userDetails.name.first} ${userDetails.name.middle} ${userDetails.name.last}`
          : "No name"}
        </Text>
      </View>

      <View style={divider.divider} />

      {userDetails && userDetails.role === 'User' ? <>
        <DrawerItem
          label="Home"
          icon={({ focused, color, size }) => (
            <Icon name="home" color={currentRoute === 'userHome' ? 'white' : colors.color2} size={26} />
          )}
          focused={currentRoute === 'userHome'}
          activeTintColor="white"
          inactiveTintColor="black"
          activeBackgroundColor={colors.color1}
          onPress={() => props.navigation.navigate('userHome')} />
        {/* <DrawerItem
          label="Profile"
          icon={({ focused, color, size }) => (
            <Icon name="account-circle" color={currentRoute === 'Dashboard' ? 'white' : colors.color2} size={26} />
          )}
          focused={currentRoute === 'Dashboard'}
          activeTintColor="white"
          inactiveTintColor="black"
          activeBackgroundColor={colors.color1}
          onPress={() => props.navigation.navigate('Dashboard')} /> */}
        <View style={styles.container}>
          <DrawerItem
            label="Schedule"
            icon={({ focused, color, size }) => (
              <Icon name="calendar" color={currentRoute === 'schedule_user' ? 'white' : colors.color2} size={26} />
            )}
            focused={currentRoute === 'schedule_user'}
            activeTintColor="white"
            inactiveTintColor="black"
            activeBackgroundColor={colors.color1}
            onPress={() => props.navigation.navigate('schedule_user', { schedules })} />
          {/* Badge */}

          <View style={currentRoute === 'schedule_user' ? [styles.badge, {backgroundColor: 'white'}]: styles.badge}>
            <Text style={currentRoute === 'schedule_user' ? [styles.badgeText, {color: 'red'}] : styles.badgeText}>{count && count}</Text>
          </View>


        </View>
      </> : <>
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

        {/* <DrawerItem
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
          onPress={() => props.navigation.navigate('My Profile')} /></> */}
          </>
          }

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
        <Stack.Screen name="employee_login" component={EmployeeLogin} />
        <Stack.Screen name="superadmin_dashboard" component={Dashboard} />
        <Stack.Screen name="superadmin_donor_record" component={DonorRecords} />
        <Stack.Screen name="superadmin_recipient_record" component={RecipientRecords} />
        <Stack.Screen name="superadmin_schedules" component={Schedule} />
        <Stack.Screen name="superadmin_metrics" component={Metrics} />
        <Stack.Screen name="superadmin_account_management" component={AccountManagement} />
        <Stack.Screen name="superadmin_account_create_admin" component={CreateAdmin} />
        <Stack.Screen name="superadmin_account_create_staff" component={CreateStaff} />


        {/* User Navigations */}
        <Stack.Screen name="userHome" component={Home} />
        <Stack.Screen name="createBag" component={CreateBag} />
        <Stack.Screen name="bagDetails" component={EditBag} />
        {/* Schedule */}
        <Stack.Screen name="editEvents" component={EditEvent} />
        <Stack.Screen name="addEvents" component={AddEvent} />
        <Stack.Screen name="schedule_user" component={PickUpSchedules} />
        <Stack.Screen name="EditSchedule" component={EditSchedule} />
        <Stack.Screen name="HistorySchedules" component={HistorySchedules} />
        {/* Articles */}
        <Stack.Screen name="superadmin_articles"
          component={Articles} />
        <Stack.Screen name="add_articles" component={AddArticles} />
        <Stack.Screen name="editArticle" component={EditArticles} />


        {/* {Fridge Inventory Navigation} */}
        <Stack.Screen name="superadmin_inventories" component={Inventory} />
        <Stack.Screen name="superadmin_fridges" component={Fridges} />
        <Stack.Screen name="InventoryCards" component={InventoryCards} />
        <Stack.Screen name="PasteurCards" component={PasteurCards} />
        <Stack.Screen name="BagCards" component={BagCards} />
        <Stack.Screen name="ConfirmBottleReserve" component={ConfirmBottleReserve} />
        <Stack.Screen name="FridgeDetails" component={FridgeDetails} />
        <Stack.Screen name="AddFridge" component={AddFridge} />
        <Stack.Screen name="EditFridge" component={EditFridge} />
        <Stack.Screen name="AddMilkInventory" component={AddMilkInventory} />
        <Stack.Screen name="EditMilkInventory" component={EditMilkInventory} />
        <Stack.Screen name="StoreCollections" component={StoreCollections} />

        <Stack.Screen name="superadmin_equipment" component={Equipment} />
        <Stack.Screen name="AddEquipment" component={AddEquipment} />
        <Stack.Screen name="EditEquipment" component={EditEquipment} />
        {/* {Request Admins Navigation} */}
        <Stack.Screen name="Inpatients" component={Inpatients} />
        <Stack.Screen name="Outpatients" component={Outpatients} />
        <Stack.Screen name="ConfirmRequest" component={ConfirmRequest} />
        <Stack.Screen name="EditRequest" component={EditRequest} />
        <Stack.Screen name="RequestOpt" component={RequestOpt} />
        <Stack.Screen name="RefRequest" component={RefRequest} />
        
        {/* {Request Staff Navigation} */}
        <Stack.Screen name="AddPatient" component={AddPatient} />
        <Stack.Screen name="AddRequest" component={AddRequest} />
        <Stack.Screen name="Requested" component={Requested} />
        <Stack.Screen name="EditStaffRequest" component={EditStaffRequest} />
        <Stack.Screen name="RequestDetails" component={RequestDetails} />

        {/* {Charts Navigation} */}
        <Stack.Screen name="MilkPerMonth" component={MilkPerMonth} />
        <Stack.Screen name="DonorsPerMonth" component={DonorsPerMonth} />
        <Stack.Screen name="DispensedPerMonth" component={DispensedPerMonth} />
        <Stack.Screen name="PatientsPerMonth" component={PatientsPerMonth} />
        <Stack.Screen name="RequestsPerMonth" component={RequestsPerMonth} />

        {/* Milk Letting Navigation*/}
        <Stack.Screen name="superadmin_milkLetting" component={MilkLetting} />
        <Stack.Screen name="AddMilkLetting" component={AddMilkLetting} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="FinalizeLetting" component={FinalizeLetting} />
        <Stack.Screen name="EditMilkLetting" component={EditMilkLetting} />
        <Stack.Screen name="HistoryLetting" component={HistoryLetting} />
        <Stack.Screen name="MilkLettingDetails" component={MilkLettingDetails} />

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
          <Drawer.Screen name="userHome" component={Home} />
          <Drawer.Screen name="schedule_user" component={PickUpSchedules} />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',

  },
  badge: {
    position: 'absolute',
    right: 20, // Adjust position to align with icon
    top: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default Main