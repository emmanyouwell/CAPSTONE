import React from 'react'
import {View, Text} from 'react-native'
import Header from '../../components/Superadmin/Header'

import { SuperAdmin } from '../../styles/Styles'
import Calendar from '../../components/Superadmin/Calendar'

const Schedule = ({navigation}) => {
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {

    }
  return (
    <View style={SuperAdmin.container}>
        <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick}/>
        <Text style={SuperAdmin.headerText}>Schedules</Text>
        <Calendar/>
    </View>
  )
}

export default Schedule