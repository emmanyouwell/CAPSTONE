import React from 'react'
import {View, Text, ImageBackground, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import RecipientRecordTable from '../../components/Superadmin/RecipientRecordTable'
import { SuperAdmin, donorRecordsStyle, colors } from '../../styles/Styles'
import recipients from '../../assets/image/recipients.jpg'
const RecipientRecords = ({navigation}) => {
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {

    }
  return (
    <View>
        <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick}/>
        <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={recipients} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Recipient Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
          <TextInput style={donorRecordsStyle.searchInput} placeholder="Search Recipient Records" placeholderTextColor="#ccc" />
          <Icon name="search" size={20} color={colors.color1} style={donorRecordsStyle.searchIcon}/>
          </View>
        </ImageBackground>
      </View>
        <RecipientRecordTable/>
    </View>
  )
}

export default RecipientRecords