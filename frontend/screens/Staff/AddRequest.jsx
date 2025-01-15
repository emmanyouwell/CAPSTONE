import React, { useState, useEffect, startTransition } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../../components/Superadmin/Header';
import { logoutUser } from '../../redux/actions/userActions';
import { getRecipients, updatePatient } from '../../redux/actions/recipientActions';
import { addRequest } from '../../redux/actions/requestActions';
import { SuperAdmin } from '../../styles/Styles';
import { getUser } from '../../utils/helper';
import moment from 'moment'; // For date formatting

const AddRequest = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const newPatient = route.params?.newPatient || null;
    const staff = route.params?.staff || '';
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({
        patient: newPatient?._id || null,
        location: '',
        diagnosis: '',
        reason: '',
        doctor: '',
        milkRequested: '',
    });
    const [priority, setPriority] = useState(null);
    const [items, setItems] = useState([
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' },
    ]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [patients, setPatients] = useState([]);
    const [patientItems, setPatientItems] = useState([]);

    useEffect(() => {
        if (!newPatient) {
            dispatch(getRecipients())
                .then((response) => {
                    const patientList = response.payload?.patients?.map((patient) => ({
                        label: patient.name,
                        value: patient._id,
                    }));
                    setPatients(response.payload?.patients || []);
                    setPatientItems(patientList || []);
                })
                .catch((error) => console.error('Error fetching patients:', error));
        } else {
            setPatientItems([{ label: newPatient.name, value: newPatient._id }]);
        }
    }, [dispatch, newPatient]);

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
            .then(() => navigation.navigate('login'))
            .catch((err) => console.log(err));
    };

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        const { patient, location, diagnosis, reason, doctor, milkRequested } = formData;

        if (!patient || !location || !diagnosis || !reason || !doctor || !milkRequested || !priority) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const staffId = staff? staff : userDetails._id

        const requestData = {
            date: moment().format('YYYY-MM-DD'), 
            patient,
            location,
            diagnosis,
            reason,
            doctor,
            priority,
            staffId,
            status: 'Pending',
        };
        
        dispatch(addRequest(requestData))
            .then(() => {
                const milkRequestData = {
                    date: moment().format('YYYY-MM-DD'),
                    milkRequested: parseInt(milkRequested, 10),
                };

                const patientToUpdate = patients.find((p) => p._id === patient) || newPatient;

                if (patientToUpdate) {
                    const updatedRequested = [...(patientToUpdate.requested || []), milkRequestData];
                    dispatch(
                        updatePatient({
                            ...patientToUpdate,
                            requested: updatedRequested,
                            id: patientToUpdate._id,
                        })
                    )
                        .then(() => {
                            Alert.alert('Success', 'Request added successfully!');
                            navigation.navigate('superadmin_dashboard');
                        })
                        .catch((error) => {
                            console.error('Error updating patient:', error);
                            Alert.alert('Error', 'Failed to update patient.');
                        });
                } else {
                    Alert.alert('Error', 'Patient not found.');
                }
            })
            .catch((error) => {
                console.error('Error adding request:', error);
                Alert.alert('Error', 'Failed to add request.');
            });
    };

    return (
        <KeyboardAvoidingView
            style={SuperAdmin.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Request Form</Text>

            <SafeAreaView style={styles.form}>
                <DropDownPicker
                    open={open}
                    value={formData.patient}
                    items={patientItems}
                    setOpen={setOpen}
                    setValue={(callback) => {
                        const newValue = callback(formData.patient);
                        handleChange('patient', newValue);
                    }}
                    setItems={setPatientItems}
                    placeholder="Select Patient"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    disabled={!!newPatient}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={formData.location}
                    onChangeText={(text) => handleChange('location', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Diagnosis"
                    value={formData.diagnosis}
                    onChangeText={(text) => handleChange('diagnosis', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Reason"
                    value={formData.reason}
                    onChangeText={(text) => handleChange('reason', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Doctor"
                    value={formData.doctor}
                    onChangeText={(text) => handleChange('doctor', text)}
                />
                <DropDownPicker
                    open={open2}
                    value={priority}
                    items={items}
                    setOpen={setOpen2}
                    setValue={setPriority}
                    setItems={setItems}
                    placeholder="Select Patient Priority"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Volume of Milk Requested (ml)"
                    keyboardType="numeric"
                    value={formData.milkRequested}
                    onChangeText={(text) => handleChange('milkRequested', text)}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        flex: 1,
        paddingHorizontal: 16,
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

export default AddRequest;