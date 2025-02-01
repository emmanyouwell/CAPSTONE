import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import Header from '../../../components/Superadmin/Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';
import { useNotification } from '../../../context/NotificationContext';

const TestNotif = ({ navigation }) => {
    const dispatch = useDispatch();
    const { notification, expoPushToken, error } = useNotification()

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    };
    console.log("Notifications Message: ", notification)
    console.log("Notifications Error: ", error)

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Test Notification</Text>

            <Text>
                EXPO TOKEN: {expoPushToken}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
});

export default TestNotif;