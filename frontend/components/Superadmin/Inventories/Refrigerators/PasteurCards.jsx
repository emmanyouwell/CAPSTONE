import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Button, RefreshControl, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

import Header from '../../Header';
import { logoutUser } from '../../../../redux/actions/userActions';
import { getInventories } from '../../../../redux/actions/inventoryActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { dataTableStyle } from '../../../../styles/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Inventory = ({ route }) => {
    const { fridge } = route.params ? route.params : null;
    const { request } = route.params ? route.params : null;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { inventory, loading, error } = useSelector((state) => state.inventories);
    const [refreshing, setRefreshing] = useState(false);

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedVolume, setSelectedVolume] = useState(0); 
    const [tempVolume, setTempVolume] = useState(null); 
    const [lastInventoryId, setLastInventoryId] = useState(null);

    useEffect(() => {
        dispatch(getInventories());
    }, [dispatch]);

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedItems([]);
        setSelectedVolume(0);
    };

    const toggleSelectItem = (id, volume) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
            setSelectedVolume(selectedVolume - volume);
        } else {
            const newTotal = selectedVolume + volume;
            if (newTotal > request.volume) {
                handleExcessVolume(id, volume, newTotal);
            } else {
                setSelectedItems([...selectedItems, id]);
                setSelectedVolume(newTotal);
            }
        }
    };

    const handleExcessVolume = (id, volume, newTotal) => {
        const excess = newTotal - request.volume;
        Alert.alert(
            "Volume Exceeds Requested Amount",
            `The total volume exceeds the requested volume by ${excess}. Adjust your selection or split the excess.`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove Excess",
                    onPress: () => adjustLastInventory(id, volume, excess),
                },
            ]
        );
    };

    const adjustLastInventory = (id, volume, excess) => {
        // Add the inventory with adjusted volume
        setSelectedItems([...selectedItems, id]);
        setSelectedVolume(request.volume);

        // Store temp volume and inventory ID
        setTempVolume(excess);
        setLastInventoryId(id);

        // Update the inventory's temp volume for the excess
        const inventoryIndex = inventory.findIndex((inv) => inv._id === id);
        if (inventoryIndex > -1) {
            inventory[inventoryIndex].tempVolume = excess;
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getInventories())
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleNavigate = () => {
        const selectedInventories = inventory.filter(inv => selectedItems.includes(inv._id));
        
        navigation.navigate('ConfirmRequest', {
            selectedInventories,
            request,
            tempVolume,
            lastInventoryId,
        });
    };

    const filteredInventories = inventory.filter(
        (inv) => inv.fridge && inv.fridge._id === fridge._id && inv.status === 'Available'
    );
    console.log("Filtered: ", filteredInventories)

    const renderCard = (inv) => {
        const isSelected = selectedItems.includes(inv._id);
        const details = fridge.fridgeType === 'Pasteurized' ? inv.pasteurizedDetails : null;
        const temp = inv.temp

        return (
            <TouchableOpacity
                key={inv._id}
                style={[styles.card, isSelected && styles.selectedCard]}
                onLongPress={() => {
                    if ((request)) {
                        toggleSelectionMode();
                    }
                }}
                onPress={() => {
                    if (selectionMode) {
                        toggleSelectItem(inv._id, temp ? temp : details?.volume || 0);
                    }
                }}
            >
                <Text style={styles.cardTitle}>Date: {formatDate(inv.inventoryDate)}</Text>
                <Text>Status: {inv.status}</Text>
                {details && fridge.fridgeType === 'Pasteurized' ? (
                        <>
                            <Text>Pasteur Date: {formatDate(details.pasteurizationDate)}</Text>
                            <Text>Batch: {details.batch}</Text>
                            <Text>Pool: {details.pool}</Text>
                            {temp !== 0 ? (
                                <Text>Remaining Volume: {temp} mL</Text>
                            ) : ( <Text>Volume: {details.volume} mL</Text> )}
                            <Text>Expiration: {formatDate(details.expiration)}</Text>
                        </>
                    ) : (
                    <Text>No details available</Text>
                    )
                }
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={() => onLogoutPress()} onMenuPress={() => navigation.openDrawer()} />

                <Text style={styles.screenTitle}>{fridge.name} Available Milk</Text>
                {!request && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.historyButton}
                            onPress={() => navigation.navigate('FridgeDetails', fridge)}
                        >
                            <Text style={styles.buttonText}>
                                <MaterialIcons name="history" size={16} color="white" /> History
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('AddMilkInventory', fridge)}
                        >
                            <Text style={styles.buttonText}>
                                <MaterialIcons name="add" size={16} color="white" /> Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={dataTableStyle.tableContainer}>
                    <ScrollView
                        style={styles.cardContainer}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                    >
                        {filteredInventories.map((inv) => renderCard(inv))}
                    </ScrollView>
                </View>
                {request && (
                    <View style={styles.section}>
                        <Text style={styles.requestTitleText}>Select Milk for Request</Text>
                        <Text style={styles.requestText}>Requested Volume: {request.volume} mL</Text>
                        <Text style={styles.requestText}>Selected Volume: {selectedVolume} mL</Text>
                    </View>
                )}
                {selectionMode && (
                    <View style={styles.selectionFooter}>
                        <Button title="Cancel" onPress={toggleSelectionMode} color="#FF3B30" />
                        <Button
                            title={`Next (${selectedItems.length} Selected)`}
                            onPress={handleNavigate}
                            disabled={selectedVolume < request.volume}
                        />
                    </View>
                )}
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
    selectedCard: {
        backgroundColor: '#D1E7FF',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    selectionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50', 
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        marginLeft: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3', 
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    requestText: {
        textAlign: 'left',
        color: '#999',
        marginVertical: 8,
    },
    requestTitleText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 8,
        fontWeight: 'bold'
    },
});

export default Inventory;