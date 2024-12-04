import React, { useState, useEffect } from 'react';
import {
    View,
    Alert,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDonors } from '../../../../redux/actions/donorActions';

import Header from '../../../../components/Superadmin/Header';
import { logoutUser } from '../../../../redux/actions/userActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { addInventory } from '../../../../redux/actions/inventoryActions';
import { getUser, viewAsyncStorage } from '../../../../utils/helper';

const AddMilkInventory = ({ route, navigation }) => {
    const fridge = route.params;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const { donors, loading, error } = useSelector((state) => state.donors);

    const [open, setOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [donorItems, setDonorItems] = useState([]);

    const [showExpressDatePicker, setShowExpressDatePicker] = useState(false);
    const [showCollectionDatePicker, setShowCollectionDatePicker] = useState(false);
    const [showPasteurizationDatePicker, setShowPasteurizationDatePicker] = useState(false);
    const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);

    useEffect(() => {
        dispatch(getDonors());
    }, [dispatch]);
   
    useEffect(() => {
        if (donors) {
            const items = donors.map((donor) => ({
                label: `${donor.name.first} ${donor.name.last}`,
                value: donor._id,
            }));
            setDonorItems(items);
        }
    }, [donors]);

    const fetchUserDetails = async () => {
        const user = await getUser();
        console.log('User:', user)
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

    const handleSubmit = async () => {
        if (!formData || (!selectedDonor && fridge.fridgeType === "Unpasteurized")) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const inventoryDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const user = await fetchUserDetails(); // Await the async function to resolve

        if (!user || !user._id) {
            Alert.alert("Error", "Failed to retrieve user details.");
            return;
        }

        const newData = {
            fridgeId: fridge._id,
            inventoryDate,
            userId: user._id, // This will now have the correct value
        };

        if (fridge.fridgeType === 'Pasteurized') {
            newData.pasteurizedDetails = {
                pasteurizationDate: formData.pasteurizationDate,
                batch: formData.batch,
                pool: formData.pool,
                bottle: formData.bottle,
                volume: formData.volume,
                expiration: formData.expirationDate,
            };

            console.log('Submitting Pasteurized Data:', newData);
        } else if (fridge.fridgeType === 'Unpasteurized') {
            newData.unpasteurizedDetails = {
                donor: selectedDonor,
                expressDate: formData.expressDate,
                collectionDate: formData.collectionDate,
                volume: formData.volume,
            };

            console.log('Submitting Unpasteurized Data:', newData);
        } else {
            console.log('Unknown fridge type');
        }

        dispatch(addInventory(newData))
            .then(() => {
                Alert.alert("Success", "Inventory has been added successfully.");
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert("Error", "Failed to add Inventory. Please try again.");
                console.error(error);
        });
    };

    const renderFormFields = () => {
        if (fridge.fridgeType === 'Unpasteurized') {
            return (
                <>
                    <DropDownPicker
                        open={open}
                        value={selectedDonor}
                        items={donorItems}
                        setOpen={setOpen}
                        setValue={setSelectedDonor}
                        setItems={setDonorItems}
                        placeholder="Select Donor"
                        style={styles.dropdown}
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
                </>
            );
        } else if (fridge.fridgeType === 'Pasteurized') {
            return (
                <>
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
                <Button title="Submit" onPress={handleSubmit} />
            </ScrollView>
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
});

export default AddMilkInventory;
