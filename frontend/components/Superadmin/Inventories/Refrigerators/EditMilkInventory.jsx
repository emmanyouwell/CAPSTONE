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
import { SuperAdmin } from '../../../../styles/Styles';
import { updateInventory } from '../../../../redux/actions/inventoryActions';
import { getUser } from '../../../../utils/helper';

const EditMilkInventory = ({ route, navigation }) => {
    const inventory = route.params;
    const fridge = inventory.fridge;

    const dispatch = useDispatch();

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
        const day = String(d.getDate()).padStart(2, '0'); // Add leading zero to day
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        expressDate: formatDate(inventory.unpasteurizedDetails?.expressDate || ''),
        collectionDate: formatDate(inventory.unpasteurizedDetails?.collectionDate || ''),
        volume: inventory.unpasteurizedDetails?.volume || inventory.pasteurizedDetails?.volume || '',
        pasteurizationDate: formatDate(inventory.pasteurizedDetails?.pasteurizationDateDate || ''),
        batch: inventory.pasteurizedDetails?.batch || '',
        pool: inventory.pasteurizedDetails?.pool || '',
        bottle: inventory.pasteurizedDetails?.bottle || '',
        expirationDate: formatDate(inventory.pasteurizedDetails?.expirationDate || ''),
        ...inventory, 
    });

    const { donors, loading, error } = useSelector((state) => state.donors);
    const [open, setOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(
        inventory.unpasteurizedDetails?.donor || null
    );
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
        console.log('User:', user);
        return user;
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

    const handleDateChange = (event, selectedDate, field) => {
        const date = selectedDate
            ? selectedDate.toISOString().split('T')[0]
            : formData[field];
        setFormData((prev) => ({ ...prev, [field]: date }));

        if (field === 'expressDate') setShowExpressDatePicker(false);
        if (field === 'collectionDate') setShowCollectionDatePicker(false);
        if (field === 'pasteurizationDate') setShowPasteurizationDatePicker(false);
        if (field === 'expirationDate') setShowExpirationDatePicker(false);
    };

    const handleSubmit = async () => {
        if (!formData || (!selectedDonor && fridge.fridgeType === 'Unpasteurized')) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const user = await fetchUserDetails();

        if (!user || !user._id) {
            Alert.alert('Error', 'Failed to retrieve user details.');
            return;
        }

        const invData = { ... inventory }

        const updatedData = {
            id: invData._id,
            inventoryDate : invData.inventoryDate,
            fridgeId: fridge._id,
            userId: user._id,
        };

        if (fridge.fridgeType === 'Pasteurized') {
            updatedData.pasteurizedDetails = {
                pasteurizationDate: formData.pasteurizationDate,
                batch: formData.batch,
                pool: formData.pool,
                bottle: formData.bottle,
                volume: formData.volume,
                expiration: formData.expirationDate,
            };
        } else if (fridge.fridgeType === 'Unpasteurized') {
            updatedData.unpasteurizedDetails = {
                donor: selectedDonor,
                expressDate: formData.expressDate,
                collectionDate: formData.collectionDate,
                volume: formData.volume,
            };
        }
        console.log('Update Data',updatedData)
        dispatch(updateInventory(updatedData))
            .then(() => {
                Alert.alert('Success', 'Inventory has been updated successfully.');
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to update Inventory. Please try again.');
                console.error(error);
            });
    };

    const renderFormFields = () => {
        if (fridge.fridgeType === 'Unpasteurized') {
            return (
                <>
                    <Text style={styles.sectionTitle}>Donor</Text>
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

                    <Text style={styles.sectionTitle}>Express Date</Text>
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
                            value={new Date(formData.expressDate || Date.now())}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'expressDate')
                            }
                        />
                    )}

                    <Text style={styles.sectionTitle}>Collection Date</Text>
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
                            value={new Date(formData.collectionDate || Date.now())}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'collectionDate')
                            }
                        />
                    )}
                    <Text style={styles.sectionTitle}>Volume (mL)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Volume"
                        keyboardType="numeric"
                        value={String(formData.volume || '')}
                        onChangeText={(value) =>
                            setFormData({ ...formData, volume: Number(value) })
                        }
                    />
                </>
            );
        } else if (fridge.fridgeType === 'Pasteurized') {
            return (
                <>
                    <Text style={styles.sectionTitle}>Pasteurization Date</Text>
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
                            value={new Date(formData.pasteurizationDate || Date.now())}
                            mode="date"
                            display="default"
                            onChange={(event, date) =>
                                handleDateChange(event, date, 'pasteurizationDate')
                            }
                        />
                    )}
                    <Text style={styles.sectionTitle}>Batch</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Batch"
                        keyboardType="numeric"
                        value={String(formData.batch || '')}
                        onChangeText={(value) =>
                            setFormData({ ...formData, batch: Number(value) })
                        }
                    />
                    <Text style={styles.sectionTitle}>Pool</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Pool"
                        keyboardType="numeric"
                        value={String(formData.pool || '')}
                        onChangeText={(value) =>
                            setFormData({ ...formData, pool: Number(value) })
                        }
                    />
                    <Text style={styles.sectionTitle}>Bottle</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Bottle"
                        keyboardType="numeric"
                        value={String(formData.bottle || '')}
                        onChangeText={(value) =>
                            setFormData({ ...formData, bottle: Number(value) })
                        }
                    />
                    <Text style={styles.sectionTitle}>Volume</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Volume"
                        keyboardType="numeric"
                        value={String(formData.volume || '')}
                        onChangeText={(value) =>
                            setFormData({ ...formData, volume: Number(value) })
                        }
                    />
                    <Text style={styles.sectionTitle}>Expiration Date</Text>
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
                            value={new Date(formData.expirationDate || Date.now())}
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
    };

    return (
        <ScrollView>
            <Header/>
            <Text style={styles.screenTitle}>Update Inventory</Text>
            <View style={styles.container}>
                {renderFormFields()}
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
});

export default EditMilkInventory;
