import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { updateFridge } from '../../../../redux/actions/fridgeActions';

import Header from '../../../../components/Superadmin/Header';
import { logoutUser } from '../../../../redux/actions/userActions';
import { SuperAdmin } from '../../../../styles/Styles';

const EditFridge = ({ route, navigation }) => {
    const { fridge } = route.params; // Extract fridge data from route params
    const dispatch = useDispatch();

    // States for form fields
    const [name, setName] = useState(fridge.name);
    const [capacity, setCapacity] = useState(String(fridge.capacity)); // Convert number to string for TextInput
    const [fridgeType, setFridgeType] = useState(fridge.fridgeType);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Pasteurized', value: 'Pasteurized' },
        { label: 'Unpasteurized', value: 'Unpasteurized' },
    ]);

    // Header Actions
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

    // Update fridge handler
    const handleUpdate = () => {
        if (!name || !capacity || !fridgeType) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const updatedFridge = {
            id: fridge._id, 
            name,
            capacity: parseInt(capacity, 10), 
            fridgeType,
        };

        dispatch(updateFridge(updatedFridge))
            .then(() => {
                Alert.alert('Success', `Fridge "${name}" has been updated successfully.`);
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to update fridge. Please try again.');
                console.error(error);
            });
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.title}>Edit Fridge</Text>

            {/* Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter fridge name"
                value={name}
                onChangeText={setName}
            />

            {/* Fridge Type Dropdown */}
            <View style={{ zIndex: 1000, marginBottom: 16 }}>
                <DropDownPicker
                    open={open}
                    value={fridgeType}
                    items={items}
                    setOpen={setOpen}
                    setValue={setFridgeType}
                    setItems={setItems}
                    placeholder="Select Fridge Type"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>

            {/* Capacity Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter capacity"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
            />

            {/* Update Button */}
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Fridge</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 8,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EditFridge;
