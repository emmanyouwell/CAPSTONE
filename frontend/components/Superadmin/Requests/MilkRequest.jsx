import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl, SafeAreaView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';
import { getRequests } from '../../../redux/actions/requestActions';

const MilkRequest = ({ navigation }) => {
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
                navigation.replace('login');
            })
            .catch((err) => console.log(err));
    };

    const handleUpdate = (row) => {
        console.log(row);
        navigation.navigate('EditRequest', { request: row });
    };

    const renderCard = (req) => {
        const { patient, volume, doctor, images} = req;
        return (
            <TouchableOpacity
                key={req._id}
                style={styles.card}
                onPress={() =>
                    Alert.alert(
                        "Complete Request",
                        `Do you want to complete Request?`,
                        [
                            { text: "Yes", onPress: () => handleUpdate(req) },
                            { text: "Cancel", style: "cancel" },
                        ]
                    )
                }
            >
                <Text style={styles.cardTitle}>Date: {formatDate(req.date)}</Text>
                <Text>Patient: {patient.name}</Text>
                <Text>Type: {patient.patientType}</Text>
                <Text>Requested Volume: {volume} mL</Text>
                <Text>Prescribed By: {doctor}</Text>
                {images && images.length > 0 ? (
                    <Image source={{ uri: images[0].url }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}
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
                        request.filter((req) => req.status === 'Pending').map((req) => renderCard(req))
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
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
});

export default MilkRequest;
