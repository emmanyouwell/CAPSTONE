import React, { useState, useEffect, startTransition } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/Superadmin/Header';
import { addPatient } from '../../redux/actions/recipientActions';
import { getUser } from '../../utils/helper';
import { SuperAdmin } from '../../styles/Styles';

const AddPatient = ({ navigation }) => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        home_address: {
            street: '',
            brgy: '',
            city: ''
        },
        phone: '',
        motherName: '',
    });

    useEffect(() => {
        startTransition(() => {
          const fetchUserDetails = async () => {
            const user = await getUser();
            setUserDetails(user);
          };
          fetchUserDetails();
        });
    }, []);

    const handleChange = (key, value) => {
        if (["street", "brgy", "city"].includes(key)) {
            setFormData((prevState) => ({
                ...prevState,
                home_address: {
                    ...prevState.home_address,
                    [key]: value,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        }
    };

    const handleSubmit = () => {
        const { name, home_address, phone, motherName } = formData;

        if (!name || !home_address || !phone || !motherName) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        dispatch(addPatient({ ...formData, staff: userDetails._id }))
            .then((response) => {
                const Params = {
                    newPatient: response.payload.patient,
                    staff: userDetails._id
                }

                Alert.alert(
                    'Success',
                    'Patient added successfully! Do you want to add a Request for the new patient?',
                    [
                        {
                            text: 'Request',
                            onPress: () =>
                                navigation.navigate('AddRequest', Params),
                        },
                        {
                            text: 'Back',
                            onPress: () => navigation.goBack(),
                            style: 'cancel',
                        },
                    ]
                );
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error', 'Failed to add patient.');
            });
    };

    return (
        <View style={SuperAdmin.container}>
            <Header/>
            <Text style={styles.screenTitle}>Patient Information</Text>

            <FlatList
                data={[{ key: 'form' }]}
                renderItem={() => (
                    <ScrollView style={styles.form}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Patient Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Name of the patient"
                                value={formData.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Mother's Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mother's Name"
                                value={formData.motherName}
                                onChangeText={(text) => handleChange('motherName', text)}
                            />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Street"
                                value={formData.home_address.street}
                                onChangeText={(text) => handleChange('street', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Baranggay"
                                value={formData.home_address.brgy}
                                onChangeText={(text) => handleChange('brgy', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                value={formData.home_address.city}
                                onChangeText={(text) => handleChange('city', text)}
                            />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Phone</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => handleChange('phone', text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add Patient</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
                keyExtractor={(item) => item.key}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    form: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default AddPatient;