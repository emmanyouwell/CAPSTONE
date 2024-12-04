import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Header from '../../components/Superadmin/Header'

import { SuperAdmin, buttonStyle } from '../../styles/Styles'
import Calendar from '../../components/Superadmin/Calendar'
import { logoutUser } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import AddEventModal from '../../components/Superadmin/Schedule/AddEventModal'
import EventModalForm from '../../components/Superadmin/Schedule/EventModalForm'
import EditEventModalForm from '../../components/Superadmin/Schedule/EditEventModalForm'
const Schedule = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState('');
  const [eventID, setEventID] = useState('');
 
  return (
    <>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={{ ...SuperAdmin.container, padding: 10 }}>

        <View style={{ display: "flex", justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10 }}>

          <Text style={SuperAdmin.headerText}>Schedules</Text>
          <EventModalForm modalVisible={modalVisible} setModalVisible={setModalVisible} eventDetails={eventDetails}/>
          <EditEventModalForm modalVisible={editModalVisible} setModalVisible={setEditModalVisible} eventID={eventID}/>
        </View>

        <Calendar setModalVisible={setModalVisible} modalVisible={modalVisible} setEventDetails={setEventDetails} editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} setEventID={setEventID}/>
        
      </View>
    </>

  )
}

export default Schedule