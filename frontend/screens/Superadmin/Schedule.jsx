import React from 'react'
import { View, Text } from 'react-native'
import Header from '../../components/Superadmin/Header'

import { SuperAdmin, sticky } from '../../styles/Styles'
import Calendar from '../../components/Superadmin/Calendar'

const Schedule = ({ navigation }) => {
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {

  }
  return (
    <View style={SuperAdmin.container}>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={[sticky.sticky, {flex: 1}]}>
        <Text style={SuperAdmin.headerText}>Schedules</Text>
        <Calendar />
      </View>
    </View>
  )
}

export default Schedule