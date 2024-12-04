import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, TextInput, Button } from 'react-native'
import { Agenda } from 'react-native-calendars'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { formatEventDetails, getUser } from '../../utils/helper';
import { getUserDetails } from '../../redux/actions/userActions';
import { getEvents, getEventDetails, deleteEvents } from '../../redux/actions/eventActions';
import { resetUpdate, resetDelete } from '../../redux/slices/eventSlice';
import { buttonStyle } from '../../styles/Styles';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
const Calendar = ({ modalVisible, setModalVisible, setEventDetails, editModalVisible, setEditModalVisible, setEventID }) => {

    const dispatch = useDispatch();
    const { userDetails, loading, error } = useSelector((state) => state.users);
    const { events, loading: eventLoading, error: eventError, isUpdated, isDeleted } = useSelector((state) => state.events)

    const [items, setItems] = useState({});
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    // Function to transform events from Redux state to the required items format

    const processEvents = (events) => {
        let newItems = {};

        events.forEach((event) => {
            // Parse the event date as a JavaScript Date object
            const eventDateObj = new Date(event.eventDetails);

            // Convert to PHT (UTC+8)
            const offset = 8 * 60 * 60 * 1000; // Offset in milliseconds (8 hours)
            const phtDateObj = new Date(eventDateObj.getTime() + offset);

            // Format the date in 'YYYY-MM-DD'
            const eventDate = phtDateObj.toISOString().split("T")[0];

            // Ensure the date exists in newItems
            if (!newItems[eventDate]) {
                newItems[eventDate] = [];
            }

            // Push the event details
            newItems[eventDate].push({
                name: event.name,
                time: phtDateObj.toLocaleTimeString("en-US", { hour12: false }), // Localized time in 24-hour format
                ...event, // Add other event properties if necessary
            });
        });

        return newItems;
    };
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


            // Merge with Redux events
            const processedEvents = processEvents(events);
            setItems((prevItems) => ({ ...prevItems, ...newItems, ...processedEvents }));


        }, 1000);
    };



    // Function to handle time selection
    const onTimeChange = (event, selectedTime) => {
        if (selectedTime !== undefined) {
            setEventTime(selectedTime);
            setShowTimePicker(false);
            setEventDetails(formatEventDetails(eventDate, eventTime));

            setEventTime(new Date());
        }
    };
    const onDayPress = (day) => {
        setEventDate(new Date(day.timestamp));
        setShowTimePicker(true)
    }

    useEffect(() => {
        dispatch(getUserDetails());
        dispatch(getEvents());
        if (isUpdated) {
            console.log("updated: ", isUpdated);
            dispatch(getEvents());
            console.log("Fetching updated events")
            dispatch(resetUpdate());
        }
        if (isDeleted) {
            console.log("deleted: ", isDeleted);
            dispatch(getEvents());
            dispatch(resetDelete());
        }
    }, [dispatch, isUpdated, isDeleted])

    useEffect(() => {
        // Process and replace items with the updated event data
        const processedEvents = processEvents(events);
        setItems(processedEvents); // Replace items entirely
    }, [events]);
    // useEffect(() => {
    //     if (userDetails) {
    //         console.log("userDetails: ", userDetails);
    //     }
    // }, [userDetails])
    // useEffect(() => {
    //     if (events) {
    //         console.log("Events: ", events);
    //     }
    // }, [events])
    // Function to render each item in the Agenda
    const renderItem = useCallback((item) => {
        const date = format(new Date(item.eventDetails), 'MM/dd/yyyy')
        const time = format(new Date(item.eventDetails), 'HH:mm')
        const handleDelete = (id) => {
            dispatch(deleteEvents(id))
        }
        const handleEdit = (id) => {
            dispatch(getEventDetails(id)).then(() => {
                setEventID(id);
                setEditModalVisible(!editModalVisible);
            }).catch((err) => console.log(err))
        }
        return (
            <View style={[styles.item, {
                flexDirection: 'row',
                alignItems: 'center', height: 100
            }]}>
                <View style={{ flex: 1 }}>
                    <Text>{item.title}</Text>
                    <Text>{date}</Text>
                    <Text>{time}</Text>
                    <Text>{item.eventStatus}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEdit(item._id)} style={styles.editButton}>
                        <Icon name="pencil" size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                        <Icon name="trash" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    });

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ ...buttonStyle.defaultBtn, alignSelf: 'flex-end' }}><Text style={buttonStyle.btnText}>Add Event</Text></TouchableOpacity>
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={new Date().toISOString().split('T')[0]} // Selects today's date
                renderItem={renderItem}
                renderEmptyDate={() => <View style={styles.emptyDate}><Text>No Events</Text></View>}
                rowHasChanged={(r1, r2) => r1.name !== r2.name}
                onDayPress={onDayPress}

            />


            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={eventTime}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}
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
    buttonContainer: {
        flexDirection: 'column', // Stack buttons vertically
        alignItems: 'center',
        justifyContent: 'center', // Center buttons vertically
        height: '100%', // Match the parent height
    },
    editButton: {
        backgroundColor: '#4CAF50', // Green for edit
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5, // Square button with slight rounding
        marginBottom: 5, // Space between edit and delete buttons
    },
    deleteButton: {
        backgroundColor: '#ff4d4d', // Red for delete
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5, // Square button with slight rounding
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        elevation: 2, // For shadow effect
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