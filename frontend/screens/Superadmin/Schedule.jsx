import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import Header from '../../components/Superadmin/Header'

import { SuperAdmin } from '../../styles/Styles'
import Calendar from '../../components/Superadmin/Calendar'
import { logoutUser } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
const Schedule = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }
  return (
    <View style={SuperAdmin.container}>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <Text style={SuperAdmin.headerText}>Schedules</Text>
      <Calendar />
    </View>
  )
}

export default Schedule