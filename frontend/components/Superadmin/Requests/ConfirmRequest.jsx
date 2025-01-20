import React, { useState, useEffect, startTransition } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';
import { updateRequest } from '../../../redux/actions/requestActions';
import { updateInventory } from '../../../redux/actions/inventoryActions';
import { getUser } from '../../../utils/helper';

const ConfirmRequest = ({ route, navigation }) => {
    const inventory = route.params?.selectedInventories
    const { request, tempVolume, lastInventoryId } = route.params;
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);
    const [outcome, setOutcome] = useState('');
    const [transport, setTransport] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        startTransition(() => {
            const fetchUserDetails = async () => {
                const user = await getUser();
                setUserDetails(user);
            };
            fetchUserDetails();
        });
    }, []);

    const calculateTotalVolume = () => {
        return inventory.reduce((total, item) => total + (item.temp !== 0 ? item.temp : item.pasteurizedDetails?.volume || 0), 0) - tempVolume;
    };

    const handleConfirm = async () => {
        if (!outcome || !transport) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        const updatedRequest = {
            id: request._id,
            date: request.date,
            patient: request.patient._id,
            location: request.location,
            diagnosis: request.diagnosis,
            reason: request.reason,
            doctor: request.doctor,
            staffId: request.staffId._id,
            status: "Done",
            volume: request.volume,
            outcome,
            tchmb: {
                ebm: inventory.map(item => ({ inv: item._id })),
                transport,
                approvedBy: userDetails?._id,
            },
        };

        if (lastInventoryId && tempVolume) {
            updatedRequest.temp = {
                id: lastInventoryId,
                vol: tempVolume
            }
        }

        try {
            // Update the request
            await dispatch(updateRequest(updatedRequest));
            console.log("Request update: ", updatedRequest)
            // Update inventory statuses and handle tempVolume update for lastInventoryId
            if (inventory && inventory.length > 0) {
                for (const item of inventory) {
                    const updatedItem = { ...item, id: item._id };

                    if (tempVolume && item._id === lastInventoryId) {
                        updatedItem.temp = tempVolume;
                    } else {
                        updatedItem.temp = 0
                        updatedItem.status = "Unavailable"
                    }
                    console.log("Inventory update: ", updatedItem)
                    // Dispatch the updateInventory action
                    await dispatch(updateInventory(updatedItem));
                }
            }

            Alert.alert("Success", "Request Completed");
            navigation.navigate('MilkRequest');
        } catch (err) {
            Alert.alert("Error", "Failed to complete the operation.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={() => dispatch(logoutUser())} onMenuPress={() => navigation.openDrawer()} />
            <Text style={styles.screenTitle}>Complete Request</Text>
            <ScrollView style={styles.receiptContainer}>
                {/* Request Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Request Details</Text>
                    <Text>Patient Name: {request.patient.name}</Text>
                    <Text>Patient Type: {request.patient.patientType}</Text>
                    <Text>Phone: {request.patient.phone}</Text>
                    <Text>Diagnosis: {request.diagnosis}</Text>
                    <Text>Reason: {request.reason}</Text>
                    <Text>Location: {request.location}</Text>
                    <Text>Doctor: {request.doctor}</Text>
                    <Text>Requested Date: {formatDate(request.date)}</Text>
                    <Text>Staff Name: {request.staffId.name}</Text>
                    <Text>Staff Email: {request.staffId.email}</Text>
                    <Text style={styles.totalVolume}>Requested Volume: {request.volume}</Text>
                </View>

                {/* Inventory Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Inventory Details</Text>
                    {inventory.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text>Milk ID: {item._id}</Text>
                            <Text>Batch: {item.pasteurizedDetails.batch}</Text>
                            <Text>Pool: {item.pasteurizedDetails.pool}</Text>
                            <Text>Expiration: {formatDate(item.pasteurizedDetails.expiration)}</Text>
                            {tempVolume && lastInventoryId === item._id ? (
                                <>
                                    <Text>Given Volume: {item.pasteurizedDetails.volume - tempVolume} mL</Text>
                                    <Text style={styles.remainingText}>Remaining Volume: {tempVolume} mL</Text>
                                </>
                            ) 
                            : item.temp !==0 ? (<Text>Given Volume: {item.temp} mL</Text>)
                            : (<Text>Given Volume: {item.pasteurizedDetails.volume} mL</Text>)}
                        </View>
                    ))}
                    <Text style={styles.totalVolume}>
                        Total Volume: {calculateTotalVolume()} mL
                    </Text>
                </View>

                {/* Form for Additional Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Complete Transaction</Text>
                    <Text style={styles.label}>Outcome:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter outcome"
                        value={outcome}
                        onChangeText={setOutcome}
                    />
                    <Text style={styles.label}>Transport:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter transport details"
                        value={transport}
                        onChangeText={setTransport}
                    />
                </View>
            </ScrollView>

            {/* Confirm Button */}
            <TouchableOpacity
                style={[styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={loading}
            >
                <Text style={styles.confirmButtonText}>
                    {loading ? "Processing..." : "Confirm Request"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    remainingText : {
        color: 'white',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        padding: 3,
        alignItems: 'center',
        borderRadius: 25,
        marginRight: 70
    },
    receiptContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemContainer: {
        marginBottom: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    totalVolume: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ConfirmRequest;