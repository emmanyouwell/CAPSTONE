import React, { useState, useEffect } from 'react'
import { View, Text, Image, ImageBackground, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { SuperAdmin, donorRecordsStyle, colors } from '../../styles/Styles'
import donorImg from '../../assets/image/donors.jpg'
import { logoutUser } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { getDonors } from '../../redux/actions/donorActions';
import { getToken, viewAsyncStorage } from '../../utils/helper';
const DonorRecords = ({ navigation }) => {
  const dispatch = useDispatch();
  const { donors, loading, error } = useSelector((state) => state.donors);
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }
  useEffect(() => {
    console.log('Dispatching getDonors...');

    dispatch(getDonors())
      .unwrap()
      .then((data) => console.log('Donors fetched:', data))
      .catch((err) => console.error('Error fetching donors:', err));
  }, [dispatch])
  useEffect(() => {
    if (donors) {
      console.log("Donors: ", donors);
    }

  }, [donors])
  return (
    <View>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={donorImg} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Donor Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
            <TextInput style={donorRecordsStyle.searchInput} placeholder="Search Donor Records" placeholderTextColor="#ccc" />
            <Icon name="search" size={20} color={colors.color1} style={donorRecordsStyle.searchIcon} />
          </View>
        </ImageBackground>
      </View>
      {loading && <Text>Loading...</Text>}
      {donors && <DonorRecordsTable donors={donors} />}
    </View>
  )
}

export default DonorRecords