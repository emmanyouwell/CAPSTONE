import React from 'react'
import { View, Text, Image, ImageBackground, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { SuperAdmin, donorRecordsStyle, colors } from '../../styles/Styles'
import donors from '../../assets/image/donors.jpg'
const DonorRecords = ({ navigation }) => {
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {

  }
  return (
    <View>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={donors} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Donor Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
          <TextInput style={donorRecordsStyle.searchInput} placeholder="Search Donor Records" placeholderTextColor="#ccc" />
          <Icon name="search" size={20} color={colors.color1} style={donorRecordsStyle.searchIcon}/>
          </View>
        </ImageBackground>
      </View>
      <DonorRecordsTable />
    </View>
  )
}

export default DonorRecords