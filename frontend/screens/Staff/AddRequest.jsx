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
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../../components/Superadmin/Header';
import { logoutUser } from '../../redux/actions/userActions';
import { getRecipients, updatePatient } from '../../redux/actions/recipientActions';
import { addRequest } from '../../redux/actions/requestActions';
import { getDevices, sendNotification } from '../../redux/actions/notifActions';
import { SuperAdmin } from '../../styles/Styles';
import { getUser } from '../../utils/helper';
import moment from 'moment'; 

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
    const [open, setOpen] = useState(false);
    const [patientItems, setPatientItems] = useState([]);
    const [patients, setPatients] = useState([]);
    const { devices } = useSelector((state) => state.devices);

    useEffect(() => {
        dispatch(getDevices());
    }, [dispatch]);

    useEffect(() => {
        if (!newPatient) {
            dispatch(getRecipients({ search: "", page: 1, pageSize: 100 }))
                .then((response) => {
                    const patientList = response.payload?.patients?.map((patient) => ({
                        label: `${patient.name} (${patient.home_address.street}, ${patient.home_address.brgy}, ${patient.home_address.city} | ${patient.phone})`,
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

        if (!patient || !location || !diagnosis || !reason || !doctor || !milkRequested) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const staffId = staff? staff : userDetails?._id

        const requestData = {
            date: moment().format('YYYY-MM-DD'), 
            patient,
            location,
            diagnosis,
            reason,
            doctor,
            staffId,
            status: 'Pending',
            volume: milkRequested
        };

        dispatch(addRequest(requestData))
            .then((res) => {
                const milkRequestData = {
                    reqId: res.payload.request._id
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
                    
                    if (devices) {
                        for (const device of devices) {
                            if (device.token && device.user.role === 'Admin' || device.user.role === 'SuperAdmin'){
                                const notifData = {
                                    token: device.token,
                                    title: "New Request for Milk",
                                    body: `A nurse issued a new request for milk with the volume of ${res.payload.request.volume} mL. Open TCHMB Portal App to see more details`
                                };
                                dispatch(sendNotification(notifData))
                                    .then((response) => {console.log("Notification Status: ", response.payload.data.status)})
                                    .catch((error) => {
                                        console.error('Error sending notification:', error);
                                        Alert.alert('Error', 'Sending Notification');
                                });
                            }
                        }
                    }
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
            <Text style={styles.screenTitle}>Request Information</Text>
            <ScrollView>
                <SafeAreaView style={styles.form} keyboardShouldPersistTaps="handled">
                    <View style={[styles.section, { zIndex: 100 }]}>
                        <Text style={styles.sectionTitle}>Patient</Text>
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
                            searchable={true} // Enable the searchable functionality
                            searchPlaceholder='Search for a patient...'
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Department</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Department"
                            value={formData.location}
                            onChangeText={(text) => handleChange('location', text)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Diagnosis</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Diagnosis"
                            value={formData.diagnosis}
                            onChangeText={(text) => handleChange('diagnosis', text)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Reason</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Reason"
                            value={formData.reason}
                            onChangeText={(text) => handleChange('reason', text)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Doctor</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Doctor"
                            value={formData.doctor}
                            onChangeText={(text) => handleChange('doctor', text)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requested Milk (mL/day)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Volume of Milk Requested (mL/day)"
                            keyboardType="numeric"
                            value={formData.milkRequested}
                            onChangeText={(text) => handleChange('milkRequested', text)}
                        />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Request</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
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
        zIndex: 1,
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
        zIndex: 100,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        zIndex: 200,
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
        zIndex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default AddRequest;