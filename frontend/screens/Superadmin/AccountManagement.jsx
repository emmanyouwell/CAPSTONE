import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { defaultStyle, SuperAdmin, colors } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'

import { useDispatch } from 'react-redux'
import { viewAsyncStorage } from '../../utils/helper'
const AccountManagement = ({ navigation }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('Dashboard loaded: ', viewAsyncStorage());

    }, [])
    return (
        <View style={SuperAdmin.container}>
            <Header/>
            <Text style={SuperAdmin.headerText}>Account Management</Text>
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                <TouchableOpacity style={style.button} onPress={() => navigation.navigate('superadmin_account_create_admin')}><Text style={style.text}>Create Admin Account</Text></TouchableOpacity>
                <TouchableOpacity style={style.button} onPress={() => navigation.navigate('superadmin_account_create_staff')}><Text style={style.text}>Create Staff Account</Text></TouchableOpacity>

            </View>

        </View>
    )
}

const style = StyleSheet.create({
    button: {

        width: '90%',
        height: 100,
        backgroundColor: colors.color1, // Button background color
        padding: 10,
        borderRadius: 20,
        margin: 5, // Space between buttons
        alignItems: 'center',
        justifyContent: 'center',

    },
    text: {
        color: '#fff', // Text color
        fontSize: 16,
        textAlign: 'center',
    }
});

export default AccountManagement