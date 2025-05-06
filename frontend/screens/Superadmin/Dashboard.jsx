import React, { useEffect, useState, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { defaultStyle, SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import MenuGrid from '../../components/Superadmin/MenuGrid'
import { logoutUser, getUserDetails } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { viewAsyncStorage, getUser } from '../../utils/helper'
import { getDevices, addDevice } from '../../redux/actions/notifActions'
import { useNotification } from '../../context/NotificationContext'
import { useFocusEffect } from '@react-navigation/native'
const Dashboard = ({ navigation }) => {
    const dispatch = useDispatch();
    const { expoPushToken } = useNotification();
    const { devices } = useSelector((state) => state.devices);
    // const [userDetails, setUserDetails] = useState(null);
    const {userDetails } = useSelector((state) => state.users);
    // 1️⃣ Fetch user details once when screen gains focus
    useFocusEffect(
        useCallback(() => {
            dispatch(getUserDetails());
        }, [dispatch]) // Only depends on `dispatch`
    );
    useEffect(()=>{
        dispatch(getUserDetails());
    },[dispatch])
    useEffect(() => {
        dispatch(getDevices());
        console.log('getting devices')
    }, [dispatch]);

    useEffect(() => {
        console.log("Expo token: ", expoPushToken);
        console.log("User details: " , userDetails);
        if (expoPushToken && userDetails) {
            const isTokenExists = devices.some(device => device.token === expoPushToken);
            console.log("Device Exist: ", isTokenExists)
            if (!isTokenExists) {
                dispatch(addDevice({ token: expoPushToken, user: userDetails._id }));
                console.log("Device added")
            }
        }
    }, [expoPushToken, userDetails, devices, dispatch]);

    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onLogoutPress = () => {
        dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
    }
    useEffect(() => {
        // console.log('Dashboard loaded: ', viewAsyncStorage());

    }, [])
    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={SuperAdmin.headerText}>Dashboard</Text>
            <MenuGrid />
        </View>
    )
}

export default Dashboard