import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, RefreshControl } from 'react-native'
import Header from '../../components/Superadmin/Header'

import { SuperAdmin, buttonStyle } from '../../styles/Styles'

import { logoutUser } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarComponent from '../../components/Superadmin/Schedule/CalendarComponent'
import { getEvents } from '../../redux/actions/eventActions'
import { ScrollView } from 'react-native-gesture-handler'
const Schedule = ({ navigation }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('month');
  const handleMenuClick = () => {
    navigation.openDrawer();
  }
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => { navigation.replace('login') }).catch((err) => console.log(err))
  }
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  useEffect(() => {

    dispatch(getEvents()).then((res) => {
      console.log("response: ", res);

      // Format events properly
      const formattedEvents = res.payload.events.filter(event => event.eventStatus !== "Done").map(event => ({
        title: event.title,
        start: new Date(event.eventDetails.start),
        end: new Date(event.eventDetails.end),
        status: event.eventStatus,
        id: event._id
      }))
      setEvents(formattedEvents); // Update state in one go
    });
  }, [dispatch]);
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getEvents())
      .then((res) => {
        console.log("response: ", res);

        // Format events properly
        const formattedEvents = res.payload.events.filter(event => event.eventStatus !== "Done").map(event => ({
          title: event.title,
          start: new Date(event.eventDetails.start),
          end: new Date(event.eventDetails.end),
          status: event.eventStatus,
          id: event._id
        }))
        setEvents(formattedEvents); // Update state in one go
        setRefreshing(false)
      })
      .catch(() => setRefreshing(false));
  };
  return (
    <>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <View style={{ ...SuperAdmin.container, padding: 10 }}>

        <View style={{ flexDirection: "row", justifyContent: 'center', gap: 4, alignItems: 'center', paddingHorizontal: 10 }}>

          <Text style={SuperAdmin.headerText}>Schedules</Text>
          <TouchableOpacity  onPress={handleRefresh}>
            <Icon name="refresh" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <CalendarComponent events={events} mode={mode} setMode={setMode} />

        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      </View>
    </>

  )
}

export default Schedule