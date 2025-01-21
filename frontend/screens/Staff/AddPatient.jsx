import React, { useState, useEffect, startTransition } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/Superadmin/Header';
import { logoutUser } from '../../redux/actions/userActions';
import { addPatient } from '../../redux/actions/recipientActions';
import { getUser } from '../../utils/helper';
import { SuperAdmin } from '../../styles/Styles';

const AddPatient = ({ navigation }) => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        motherName: '',
        patientType: 'Inpatient',
        hospital: 'Taguig-Pateros District Hospital',
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

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        const { name, address, phone, hospital, patientType, motherName } = formData;

        if (!name || !address || !phone || !hospital || !patientType || !motherName) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

    console.log("Form Data: ", formData)
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
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={styles.screenTitle}>Patient Information</Text>

            <FlatList
                data={[{ key: 'form' }]}
                renderItem={() => (
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name of the patient"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mother's Name"
                            value={formData.motherName}
                            onChangeText={(text) => handleChange('motherName', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add Patient</Text>
                        </TouchableOpacity>
                    </View>
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
});

export default AddPatient;