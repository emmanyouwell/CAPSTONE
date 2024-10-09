import React from 'react'
import {View, Text} from 'react-native'
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { SuperAdmin } from '../../styles/Styles'

const DonorRecords = ({navigation}) => {
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {

    }
  return (
    <View>
        <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick}/>
        <Text style={SuperAdmin.headerText}>Donor Records</Text>
        <DonorRecordsTable/>
    </View>
  )
}

export default DonorRecords