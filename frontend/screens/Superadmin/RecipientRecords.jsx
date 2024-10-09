import React from 'react'
import {View, Text} from 'react-native'
import Header from '../../components/Superadmin/Header'
import RecipientRecordTable from '../../components/Superadmin/RecipientRecordTable'
import { SuperAdmin } from '../../styles/Styles'

const RecipientRecords = ({navigation}) => {
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {

    }
  return (
    <View>
        <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick}/>
        <Text style={SuperAdmin.headerText}>Recipient Records</Text>
        <RecipientRecordTable/>
    </View>
  )
}

export default RecipientRecords