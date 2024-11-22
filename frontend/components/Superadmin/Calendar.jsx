import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, TextInput, Button } from 'react-native'
import { Agenda } from 'react-native-calendars'
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import { getUser } from '../../utils/helper';
import { getUserDetails } from '../../redux/actions/userActions';
const Calendar = () => {
    const dispatch = useDispatch();
    const {userDetails, loading, error} = useSelector((state)=>state.users);
    const [items, setItems] = useState({});
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    // Function to load items into the calendar
    const loadItems = (day) => {
        setTimeout(() => {
            let newItems = {};
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!items[strTime]) {
                    newItems[strTime] = [];
                }
            }
            setItems({ ...items, ...newItems });
        }, 1000);
    };

    // Function to handle adding new events
    const addEvent = () => {
        if (!eventName || !eventDate || !eventTime) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const eventDateString = eventDate.toISOString().split('T')[0]; // Get the date part (e.g., "2024-11-22")
        const eventTimeString = eventTime.toTimeString().split(' ')[0]; 
        const eventDetails = `${eventDateString}T${eventTimeString}`;

        if (!items[eventDetails]) {
            items[eventDetails] = [];
        }
        
        const newEvent = {
            title: eventName,
            description: "Enter description",
            eventDetails,
            height: 100, // Adjust this as needed
            user: userDetails._id
        };

        setItems({
            ...items,
            [eventDetails]: [...items[eventDetails], newEvent],
        });

        setEventName(''); // Reset input fields
        setEventDate(new Date());
        setEventTime(new Date());
    };

    // Function to handle time selection
    const onTimeChange = (event, selectedTime) => {
        if (selectedTime !== undefined) {
            setEventTime(selectedTime);
            setShowTimePicker(false);
        }
    };
    const onDayPress = (day) => {
        setEventDate(new Date(day.timestamp));
    }

    useEffect(()=>{
        dispatch(getUserDetails());
    },[dispatch])

    useEffect(()=>{
        if (userDetails){
            console.log("userDetails: ", userDetails);
        }
    },[userDetails])
    // Function to render each item in the Agenda
    const renderItem = useCallback((item) => (
        <View style={[styles.item, { height: item.height }]}>
            <Text>{item.name}</Text>
            <Text>{item.time}</Text>
        </View>
    ));
    return (
        <SafeAreaView style={styles.container}>
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={new Date().toISOString().split('T')[0]} // Selects today's date
                renderItem={renderItem}
                renderEmptyDate={() => <View style={styles.emptyDate}><Text>No Events</Text></View>}
                rowHasChanged={(r1, r2) => r1.name !== r2.name}
                onDayPress={onDayPress}
            />

            {/* Event Input Form */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Event Name"
                    style={styles.input}
                    value={eventName}
                    onChangeText={setEventName}
                />

                {/* <TextInput
                    placeholder="Event Time (HH:MM)"
                    style={styles.input}
                    value={eventTime}
                    onChangeText={setEventTime}
                /> */}
                <Text style={styles.label}>Selected Time:</Text>
                <Text style={styles.dateText}>{eventTime.toLocaleTimeString()}</Text>
                <Text style={styles.label}>Selected Date:</Text>
                <Text style={styles.dateText}>{eventDate.toLocaleDateString()}</Text>
                <View>
                    <Button onPress={() => setShowTimePicker(true)} title="Select Event Time" />
                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={eventTime}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    )}
                </View>
                <Button title="Add Event" onPress={addEvent} />

            </View>
        </SafeAreaView>
    )
}
const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    }
})

export default Calendar