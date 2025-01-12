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
        patientType: '',
        hospital: '',
    });

    const [open, setOpen] = useState(false); // Dropdown open state
    const [patientType, setPatientType] = useState(null); // Dropdown value
    const [items, setItems] = useState([
        { label: 'Inpatient', value: 'Inpatient' },
        { label: 'Outpatient', value: 'Outpatient' },
    ]);

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
        const { name, address, phone, hospital } = formData;

        if (!name || !address || !phone || !hospital || !patientType) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        dispatch(addPatient({ ...formData, patientType, staff: userDetails._id }))
            .then((response) => {
                const Params = {
                    newPatient: response.payload.patient,
                    staff: userDetails._id
                }
                console.log("Params: ", Params)  
                Alert.alert(
                    'Success',
                    'Patient added successfully! Do you want to add a Request?',
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
                data={[{ key: 'form' }]} // Single-item list for layout
                renderItem={() => (
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
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
                        <DropDownPicker
                            open={open}
                            value={patientType}
                            items={items}
                            setOpen={setOpen}
                            setValue={setPatientType}
                            setItems={setItems}
                            placeholder="Select Patient Type"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Hospital"
                            value={formData.hospital}
                            onChangeText={(text) => handleChange('hospital', text)}
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