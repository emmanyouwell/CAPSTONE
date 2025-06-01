import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { logoutUser } from '../../../redux/actions/userActions'
import Header from '../../../components/Superadmin/Header'
import { SuperAdmin } from '../../../styles/Styles'
import { Card } from 'react-native-paper'
const PickUpSchedules = ({ navigation }) => {
    const route = useRoute();
    const { schedules } = route.params || [];
    const dispatch = useDispatch();
    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onLogoutPress = () => {
        dispatch(logoutUser()).then(() => { navigation.replace('login') }).catch((err) => console.log(err))
    }
    useEffect(() => {
        if (schedules) {
            console.log('Schedules:', schedules);
        }
    }, [schedules])
    // Status color mapping
    const statusColors = {
        Pending: "#FFC107",  // Orange
        Approved: "#E53777", // Blue
        Completed: "#4CAF50", // Green
    };
    return (
        <>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <View style={styles.container}>
                <Text style={SuperAdmin.headerText}>Schedule</Text>
                <ScrollView>
                    {schedules && schedules.map((schedule, index) => (
                        <Card style={styles.card} key={index}>
                            <Card.Content>
                                <Text style={styles.title}>Schedule Details</Text>
                                <View style={[styles.row, { flexWrap: "wrap" }]}>

                                    <Text style={styles.label}>📍 Address:</Text>
                                    <Text style={styles.value}>{schedule.address}</Text>

                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>📅 Date:</Text>
                                    <Text style={styles.value}>{new Date(schedule.dates).toLocaleString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true, // Ensures AM/PM format
                                    })}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.label}>🥛 Total Volume:</Text>
                                    <Text style={styles.value}>{schedule.totalVolume} ml</Text>
                                </View>

                                <View style={[styles.statusContainer, { backgroundColor: statusColors[schedule.status] || "#ccc" }]}>
                                    <Text style={styles.statusText}>{schedule.status}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            </View>

        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        gap: 16,
    },
    card: {
        margin: 10,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",

        color: "#333",
        flexWrap: "wrap",
        width: "40%"
    },
    value: {
        fontSize: 14,
        color: "#666",
        flexShrink: 1,
        flexWrap: "wrap",
        width: "60%"
    },
    statusContainer: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
})


export default PickUpSchedules