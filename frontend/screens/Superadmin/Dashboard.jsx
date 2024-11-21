import React, {useEffect, useState} from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { defaultStyle, SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import MenuGrid from '../../components/Superadmin/MenuGrid'
import { logoutUser } from '../../redux/actions/userActions'
import { useDispatch } from 'react-redux'
import { viewAsyncStorage } from '../../utils/helper'
const Dashboard = ({navigation}) => {
    const dispatch = useDispatch();
    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onLogoutPress = () => {
        dispatch(logoutUser()).then(()=>{navigation.navigate('login')}).catch((err)=>console.log(err))
    }
    useEffect(()=>{
        console.log('Dashboard loaded: ', viewAsyncStorage());
        
    },[])
    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress}/>
            <Text style={SuperAdmin.headerText}>Admin Dashboard</Text>
            <MenuGrid/>
        </View>
    )
}

export default Dashboard