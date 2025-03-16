import React, { useState, useEffect } from 'react';
import { View, Alert, Text, Button, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDonors } from '../../../../redux/actions/donorActions';
import Header from '../../../../components/Superadmin/Header';
import { logoutUser } from '../../../../redux/actions/userActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { addInventory, updateInventory } from '../../../../redux/actions/inventoryActions';
import { getFridges } from '../../../../redux/actions/fridgeActions';
import { getUser } from '../../../../utils/helper';
import { updateDonor } from '../../../../redux/actions/donorActions';

const AddMilkInventory = ({ route, navigation }) => {

    const fridge = route.params.selectedInventories ? { fridgeType: "Pasteurized" } : route.params;

    const items = route.params.selectedInventories ? route.params.selectedInventories : [];

    const totalVolume = items.reduce((total, item) => total + (item.unpasteurizedDetails?.quantity * item.unpasteurizedDetails?.volume || 0), 0);

    const dispatch = useDispatch();
    const [formData, setFormData] = useState(() => ({
        volume: totalVolume || '',
        quantity: '',
    }));
    const { donors, loading, error } = useSelector((state) => state.donors);
    const { fridges } = useSelector((state) => state.fridges);

    const [open, setOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [donorItems, setDonorItems] = useState([]);

    const [selectedFridge, setSelectedFridge] = useState(null);
    const [fridgeItems, setFridgeItems] = useState([]);

    const [donations, setDonations] = useState([]);
    const [showExpressDatePicker, setShowExpressDatePicker] = useState(false);
    const [showCollectionDatePicker, setShowCollectionDatePicker] = useState(false);
    const [showPasteurizationDatePicker, setShowPasteurizationDatePicker] = useState(false);
    const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);

    useEffect(() => {
        dispatch(getFridges())
        dispatch(getDonors({ search: "", page: 1, pageSize: 100 }))
    }, [dispatch]);

    useEffect(() => {
        if (donors) {
            const items = donors.map((donor) => (
                {
                label: `${donor.name.first} ${donor.name.last} (${donor.home_address.street}, ${donor.home_address.brgy}, ${donor.home_address.city} | ${donor.phone} | ${donor.donorType})`,
                value: donor._id,
            }));
            setDonorItems(items);
        }
        if (fridges) {
            const filteredFridges = fridges.filter((fridge) => fridge.fridgeType === 'Pasteurized');
            const items = filteredFridges.map((fridge) => ({
                label: `${fridge.name}`,
                value: fridge._id,
            }));
            setFridgeItems(items);
        }
    }, [donors, fridges]);

    const fetchUserDetails = async () => {
        const user = await getUser();
        return user
    };

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const handleDateChange = (event, selectedDate, field) => {
        const date = selectedDate || formData[field];
        setFormData({ ...formData, [field]: date.toISOString().split('T')[0] });

        if (field === 'expressDate') setShowExpressDatePicker(false);
        if (field === 'collectionDate') setShowCollectionDatePicker(false);
        if (field === 'pasteurizationDate') setShowPasteurizationDatePicker(false);
        if (field === 'expirationDate') setShowExpirationDatePicker(false);
    };

    const addDonation = () => {
        const { expressDate, collectionDate, volume, quantity } = formData;

        if (!expressDate || !collectionDate || !volume || !quantity) {
            Alert.alert("Error", "Please fill out all fields for the donation.");
            return;
        }
        const expiration = new Date(expressDate);
        expiration.setDate(expiration.getDate() + 14);
        
        const newDonation = {
            donor: selectedDonor,
            expressDate,
            collectionDate,
            volume: Number(volume),
            expiration: expiration.getTime(),
            quantity: Number(quantity),
        };

        setDonations([...donations, newDonation]);
        setFormData({ ...formData, expressDate: '', collectionDate: '', volume: '', quantity: '' });
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
                navigation.replace('login');
            })
            .catch((err) => console.log(err));
    };

    const handleSubmit = async () => {
        if (!formData || (!selectedDonor && fridge.fridgeType === "Unpasteurized")) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        if (!formData || (!selectedFridge && !items)) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const inventoryDate = new Date().toISOString().split("T")[0];
        const user = await fetchUserDetails();

        if (!user || !user._id) {
            Alert.alert("Error", "Failed to retrieve user details.");
            return;
        }

        const fid = selectedFridge ? selectedFridge : fridge._id;

        const newData = {
            fridgeId: fid,
            inventoryDate,
            userId: user._id,
            status: "Available",
            temp: 0
        };

        if (fridge.fridgeType === "Pasteurized") {
            const {
                pasteurizationDate,
                batch,
                pool,
                bottle,
                volume,
                expirationDate,
            } = formData;

            if (!pasteurizationDate || !batch || !pool || !bottle || !volume || !expirationDate) {
                Alert.alert("Error", "Please fill out all fields for pasteurized milk.");
                return;
            }

            newData.pasteurizedDetails = {
                pasteurizationDate,
                batch,
                pool,
                bottle,
                volume,
                expiration: expirationDate,
            };

            try {
                dispatch(addInventory(newData));
                Alert.alert("Success", "Inventory has been added successfully.");

                if (items && items.length > 0) {
                    for (const item of items) {
                        const updatedItem = { ...item, status: "Unavailable", id: item._id };
                        dispatch(updateInventory(updatedItem));
                        console.log(`Updated item ${item._id} to Unavailable`);
                    }
                }

                navigation.goBack();
            } catch (error) {
                Alert.alert("Error", "Failed to add Inventory or update item status. Please try again.");
                console.error(error);
            }
        } else if (fridge.fridgeType === "Unpasteurized") {
            if (!selectedDonor || donations.length === 0) {
                Alert.alert("Error", "Please add at least one donation.");
                return;
            }

            try {
                const inventoryId = [];
                for (const donation of donations) {
                    const newInventoryData = {
                        ...newData,
                        unpasteurizedDetails: donation,
                    };
                    await dispatch(addInventory(newInventoryData))
                        .then((res) => {
                            const newInvId = res.payload.inventory._id; 
                            inventoryId.push({ invId: newInvId }); 
                        })
                        .catch((error) => {
                            console.error('Error adding inventory:', error);
                            Alert.alert('Error', 'Failed to add inventory.');
                        });
                }

                const donorToUpdate = donors.find((donor) => donor._id === selectedDonor);
                const updatedDonor = {
                    ...donorToUpdate,
                    donation: [...(donorToUpdate.donation || []), ...inventoryId], 
                    id: selectedDonor,
                };

                dispatch(updateDonor(updatedDonor))

                Alert.alert("Success", "Inventory Added and Donor Updated");
                navigation.goBack();
            } catch (error) {
                Alert.alert("Error", "Failed to add Inventory. Please try again.");
                console.error(error);
            }
        } else {
            console.log("Unknown fridge type");
            Alert.alert("Error", "Unknown fridge type. Please contact support.");
        }
    };

    const renderFormFields = () => {
        if (fridge.fridgeType === 'Unpasteurized') {
            return (
                <>
                    <View style={styles.section}>
                    <DropDownPicker
                        open={open}
                        value={selectedDonor}
                        items={donorItems}
                        setOpen={setOpen}
                        setValue={setSelectedDonor}
                        setItems={setDonorItems}
                        placeholder="Select Donor"
                        style={styles.dropdown}
                        listItemContainerStyle={{ height: 60, borderBottomWidth: 1 }}
                        searchable={true}
                        searchPlaceholder='Search for a donor...'
                        disabled={donations.length > 0 ? true : false}
                    />

                    <TouchableOpacity
                        onPress={() => setShowExpressDatePicker(true)}
                        style={styles.datePickerButton}
                    >
                        <Text style={styles.datePickerText}>
                            {formData.expressDate || 'Select Express Date'}
                        </Text>
                    </TouchableOpacity>
                    {showExpressDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'expressDate')
                            }
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => setShowCollectionDatePicker(true)}
                        style={styles.datePickerButton}
                    >
                        <Text style={styles.datePickerText}>
                            {formData.collectionDate || 'Select Collection Date'}
                        </Text>
                    </TouchableOpacity>
                    {showCollectionDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'collectionDate')
                            }
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Volume"
                        keyboardType="numeric"
                        onChangeText={(value) => setFormData({ ...formData, volume: Number(value) })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Quantity"
                        keyboardType="numeric"
                        onChangeText={(value) => setFormData({ ...formData, quantity: Number(value) })}
                    />

                    <Button title="Add Milk Info" onPress={addDonation} />
                    </View>
                    
                    {donations.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.donationsList}>
                                <Text style={styles.subTitle}>Donations:</Text>
                                {donations.map((donation, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text>Express Date: {donation.expressDate}</Text>
                                        <Text>Collection Date: {donation.collectionDate}</Text>
                                        <Text>Volume: {donation.volume} mL</Text>
                                        <Text>Quantity: {donation.quantity}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </>
            );
        } else if (fridge.fridgeType === 'Pasteurized') {
            return (
                <>
                    <DropDownPicker
                        open={open}
                        value={selectedFridge}
                        items={fridgeItems}
                        setOpen={setOpen}
                        setValue={setSelectedFridge}
                        setItems={setFridgeItems}
                        placeholder="Select Fridge"
                        style={styles.dropdown}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPasteurizationDatePicker(true)}
                        style={styles.datePickerButton}
                    >
                        <Text style={styles.datePickerText}>
                            {formData.pasteurizationDate || 'Select Pasteurization Date'}
                        </Text>
                    </TouchableOpacity>
                    {showPasteurizationDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'pasteurizationDate')
                            }
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Batch"
                        keyboardType="numeric"
                        onChangeText={(value) => setFormData({ ...formData, batch: Number(value) })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Pool"
                        keyboardType="numeric"
                        onChangeText={(value) => setFormData({ ...formData, pool: Number(value) })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Bottle"
                        keyboardType="numeric"
                        onChangeText={(value) => setFormData({ ...formData, bottle: Number(value) })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Volume"
                        keyboardType="numeric"
                        value={formData.volume.toString()}
                        onChangeText={(value) => setFormData({ ...formData, volume: Number(value) })}
                    />

                    <TouchableOpacity
                        onPress={() => setShowExpirationDatePicker(true)}
                        style={styles.datePickerButton}
                    >
                        <Text style={styles.datePickerText}>
                            {formData.expirationDate || 'Select Expiration Date'}
                        </Text>
                    </TouchableOpacity>
                    {showExpirationDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'expirationDate')
                            }
                        />
                    )}
                </>
            );
        }
        return null;
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Add Inventory</Text>
                {renderFormFields()}
            </ScrollView>
            <Button title="Submit Inventory" onPress={handleSubmit} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    dropdown: {
        marginBottom: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    datePickerButton: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 16,
    },
    datePickerText: {
        color: '#000',
    },
    donationsList: {
        marginTop: 20,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
    },
    itemContainer: {
        marginBottom: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    section: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
});

export default AddMilkInventory;