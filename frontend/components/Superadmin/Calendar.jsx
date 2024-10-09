import React, { useState } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, TextInput, Button } from 'react-native'
import { Agenda } from 'react-native-calendars'

const Calendar = () => {
    const [items, setItems] = useState({});
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');

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

        const eventDateTime = `${eventDate}T${eventTime}:00`;

        if (!items[eventDate]) {
            items[eventDate] = [];
        }

        const newEvent = {
            name: eventName,
            height: 100, // Adjust this as needed
            time: eventTime,
        };

        setItems({
            ...items,
            [eventDate]: [...items[eventDate], newEvent],
        });

        setEventName(''); // Reset input fields
        setEventDate('');
        setEventTime('');
    };

    // Function to render each item in the Agenda
    const renderItem = (item) => (
        <View style={[styles.item, { height: item.height }]}>
            <Text>{item.name}</Text>
            <Text>{item.time}</Text>
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={new Date().toISOString().split('T')[0]} // Selects today's date
                renderItem={renderItem}
                renderEmptyDate={() => <View style={styles.emptyDate}><Text>No Events</Text></View>}
                rowHasChanged={(r1, r2) => r1.name !== r2.name}
            />

            {/* Event Input Form */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Event Name"
                    style={styles.input}
                    value={eventName}
                    onChangeText={setEventName}
                />
                <TextInput
                    placeholder="Event Date (YYYY-MM-DD)"
                    style={styles.input}
                    value={eventDate}
                    onChangeText={setEventDate}
                />
                <TextInput
                    placeholder="Event Time (HH:MM)"
                    style={styles.input}
                    value={eventTime}
                    onChangeText={setEventTime}
                />
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
})

export default Calendar