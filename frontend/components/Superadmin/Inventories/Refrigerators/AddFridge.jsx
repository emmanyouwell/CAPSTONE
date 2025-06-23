import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { addFridges } from '../../../../redux/actions/fridgeActions'; 

import Header from '../../../../components/Superadmin/Header';
import { SuperAdmin } from '../../../../styles/Styles';

const AddFridge = () => {
    const dispatch = useDispatch(); 
    const [name, setName] = useState('');
    const [fridgeType, setFridgeType] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Pasteurized', value: 'Pasteurized' },
        { label: 'Unpasteurized', value: 'Unpasteurized' },
    ]);

    const handleSubmit = () => {
        if (!name || !fridgeType ) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const newFridge = {
            name,
            fridgeType,
        };

        dispatch(addFridges(newFridge))
            .then(() => {
                Alert.alert('Success', `Fridge "${name}" has been added!.`);
                setName(''); 
                setFridgeType(null);
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to add fridge. Please try again.');
                console.error(error);
            });
    };

    return (
        <View style={SuperAdmin.container}>
            <Header/>
            <View style={styles.container}>
                <Text style={styles.title}>Add New Fridge</Text>

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

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Add Fridge</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
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

export default AddFridge;
