import React, { useState, useEffect } from 'react'
import { View, Text, Image, ImageBackground, TextInput, RefreshControl, ScrollView } from 'react-native'
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
  const { donors, count, pageSize, loading, error } = useSelector((state) => state.donors);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }
  // Using onChangeText to update the state when text changes
  const handleTextChange = (newText) => {
    setQuery(newText);
  };
  const handleSubmit = () => {
    dispatch(getDonors(query));
  }
  useEffect(() => {
    console.log('Dispatching getDonors...');

    dispatch(getDonors())
      .unwrap()
      .then((data) => console.log('Donors fetched:', data))
      .catch((err) => console.error('Error fetching donors:', err));
  }, [dispatch])

  useEffect(() => {
    if (query) {
      console.log('Query:', query);
    }
  }, [query])

  const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getDonors())
          .then(() => setRefreshing(false))
          .catch(() => setRefreshing(false));
    };
    
  return (
    <View>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={donorImg} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Donor Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
            <TextInput style={donorRecordsStyle.searchInput} placeholder="Search Donor Records" placeholderTextColor="#ccc" onChangeText={handleTextChange} onSubmitEditing={handleSubmit}  // This will trigger when the user presses 'Enter'
              returnKeyType="Search"  // Change the return key to 'Search' for a better UX
            />
            <Icon name="search" size={20} color={colors.color1} style={donorRecordsStyle.searchIcon} />
          </View>
        </ImageBackground>
      </View>
      <ScrollView
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (<Text>Loading...</Text>) : donors && <DonorRecordsTable donors={donors} count={count} pageSize={pageSize}/>}
      </ScrollView>
      
      
    </View>
  )
}

export default DonorRecords