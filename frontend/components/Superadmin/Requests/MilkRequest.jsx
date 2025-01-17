import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';
import { getRequests } from '../../../redux/actions/requestActions';

const MilkRequest = ({ route, navigation }) => {
    const items = route.params? route.params.selectedInventories : [];
    const dispatch = useDispatch();
    const { request, loading, error } = useSelector((state) => state.requests);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getRequests());
    }, [dispatch]);

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getRequests())
            .finally(() => setRefreshing(false));
    };

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    };

    const handleUpdate = (row) => {
        const newData = {
            request: row,
            inventory: items,
        };
        navigation.navigate('ConfirmRequest', newData);
    };

    const sortedRequests = request
        .filter((req) => req.status === 'Pending')
        .sort((a, b) => {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

    const renderCard = (req) => {
        const cardColors = {
            High: '#FF6B6B', 
            Medium: '#FFA500', 
            Low: '#32CD32', 
        };

        return (
            <TouchableOpacity
                key={req._id}
                style={[styles.card, { borderColor: cardColors[req.priority], borderWidth: 2 }]}
                onPress={() =>
                    Alert.alert(
                        "Complete Request",
                        `Do you want to complete Request ${req._id}?`,
                        [
                            { text: "Yes", onPress: () => handleUpdate(req) },
                            { text: "Cancel", style: "cancel" },
                        ]
                    )
                }
            >
                <Text style={[styles.cardTitle, { color: cardColors[req.priority] }]}>Priority: {req.priority}</Text>
                <Text style={styles.cardTitle}>Date: {formatDate(req.date)}</Text>
                <Text>Status: {req.status}</Text>
                <Text>Patient: {req.patient.name}</Text>
                <Text>Type: {req.patient.patientType}</Text>
                <Text>Location: {req.location}</Text>
                <Text>Prescribed By: {req.doctor}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={styles.screenTitle}>Milk Requests Pending</Text>
            <ScrollView
                style={styles.cardContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <SafeAreaView style={styles.form}>
                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : error ? (
                        <View style={styles.center}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        sortedRequests.map((req) => renderCard(req))
                    )}
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        paddingHorizontal: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    cardContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default MilkRequest;
