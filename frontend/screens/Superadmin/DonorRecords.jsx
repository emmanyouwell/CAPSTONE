import React, { useState, useEffect } from 'react'
import { View, Text, Image, ImageBackground, TextInput, RefreshControl, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { donorRecordsStyle, colors } from '../../styles/Styles'
import donorImg from '../../assets/image/donors.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { getDonors } from '../../redux/actions/donorActions';

const DonorRecords = ({ navigation }) => {
  const dispatch = useDispatch();
  const { donors, pageSize, totalDonors, totalPages, loading, error } = useSelector((state) => state.donors);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Using onChangeText to update the state when text changes
  const handleTextChange = (newText) => {
    setSearch(newText);
  };
  const handleSubmit = () => {
    setCurrentPage(0);
    dispatch(getDonors({search: search}));

  }
  useEffect(() => {
    console.log('Dispatching getDonors...');

    dispatch(getDonors({search: search, page: currentPage+1, pageSize: pageSize}))
      .unwrap()
      .then((data) => console.log('Donors fetched:', data))
      .catch((err) => console.error('Error fetching donors:', err));
  }, [dispatch, search, currentPage])

  

  const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getDonors())
          .then(() => setRefreshing(false))
          .catch(() => setRefreshing(false));
    };
    
  return (
    <View>
      <Header/>
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
        {loading ? (<Text>Loading...</Text>) : donors && <DonorRecordsTable donors={donors} setCurrentPage={setCurrentPage} currentPage={currentPage} pageSize={pageSize} totalDonors={totalDonors} totalPages={totalPages}/>}
      </ScrollView>
      
      
    </View>
  )
}

export default DonorRecords