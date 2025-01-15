import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, TextInput, RefreshControl, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import RecipientRecordTable from '../../components/Superadmin/RecipientRecordTable'
import { SuperAdmin, donorRecordsStyle, colors } from '../../styles/Styles'
import recipientsImg from '../../assets/image/recipients.jpg'
import { getRecipients } from '../../redux/actions/recipientActions';
import { logoutUser } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

const RecipientRecords = ({ navigation }) => {
  const dispatch = useDispatch();
  const { recipients, count, pageSize, loading, error } = useSelector((state) => state.recipients);

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
    dispatch(getRecipients(query));
  }
  useEffect(() => {
    console.log('Dispatching getDonors...');

    dispatch(getRecipients())
      .unwrap()
      .then((data) => console.log('Recipients fetched:', data))
      .catch((err) => console.error('Error fetching donors:', err));
  }, [dispatch])

  const handleRefresh = () => {
      setRefreshing(true);
      dispatch(getRecipients())
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false));
  };

  return (
    <View>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={recipientsImg} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Recipient Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
            <TextInput style={donorRecordsStyle.searchInput} placeholder="Search Recipient Records" placeholderTextColor="#ccc" onChangeText={handleTextChange} onSubmitEditing={handleSubmit}  // This will trigger when the user presses 'Enter'
              returnKeyType="Search" />
            <Icon name="search" size={20} color={colors.color1} style={donorRecordsStyle.searchIcon} />
          </View>
        </ImageBackground>
      </View>
      <ScrollView
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (<Text>Loading...</Text>) : recipients && <RecipientRecordTable recipients={recipients} count={count} pageSize={pageSize} />}
      </ScrollView>

    </View>
  )
}

export default RecipientRecords