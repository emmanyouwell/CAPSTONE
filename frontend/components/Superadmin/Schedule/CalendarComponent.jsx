import React, { useState, useEffect } from 'react'
import { Calendar } from 'react-native-big-calendar'
import { useDispatch, useSelector } from 'react-redux'
import { getEvents } from '../../../redux/actions/eventActions'
import { View, Button, Text, RefreshControl } from 'react-native'
import { format } from 'date-fns'
import { useNavigation } from '@react-navigation/native'
import { buttonStyle } from '../../../styles/Styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
const CalendarComponent = ({events, mode, setMode, }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const [events, setEvents] = useState([]);
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { events: data, loading, error } = useSelector(state => state.events)
    
    const toggleMode = (mode) => {
        setMode(mode);
    }
    const handleVisibleDateChange = (date) => {
        // Update the current month when the visible date changes
        setCurrentMonth(date);
    };

    const handleEventPress = (event) => {
        navigation.navigate('editEvents', { id: event.id });
    }
    const getEventColor = (status) => {
        switch (status) {
            case "Not-Due":
                return '#7A7A7A'; // Gray for completed events
            case "On-Going":
                return '#E53777'; // Green for upcoming events
            case "Done":
                return '#4CAF50'; // Orange for ongoing events
            default:
                return "#E53777"; // Default color
        }
    };
    
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4, padding: 8 }}>
                {mode === 'month' ? (
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                        {format(currentMonth, "MMMM yyyy")}
                    </Text>
                ) : <TouchableOpacity style={buttonStyle.smallBtn} onPress={() => navigation.navigate('addEvents')}>
                    <Text style={buttonStyle.btnText}>Add Event</Text></TouchableOpacity>}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity style={buttonStyle.smallBtn} onPress={() => toggleMode('month')}>
                        <Text style={buttonStyle.btnText}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle.smallBtn} onPress={() => toggleMode('schedule')}>
                        <Text style={buttonStyle.btnText}>Schedule</Text>
                    </TouchableOpacity>
                </View>


            </View>
            {/* Display the Current Month */}

            {!loading &&
                <Calendar
                    events={events}
                    height={600}
                    eventCellStyle={(event)=> ({
                        backgroundColor: getEventColor(event.status), // Set color dynamically
                        borderRadius: 5, // Optional: Add rounded corners for better UI
                        padding: 5, // Optional: Adjust padding
                    })}
                    mode={mode}
                    onSwipeEnd={handleVisibleDateChange} // Trigger on swipe
                    onPressEvent={handleEventPress}
                    
                />}
             
        </View>
    )

}

export default CalendarComponent