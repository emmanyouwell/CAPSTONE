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
import Header from '../Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { getRecipients, updatePatient } from '../../../redux/actions/recipientActions';
import { addRequest, updateRequest } from '../../../redux/actions/requestActions';
import { SuperAdmin } from '../../../styles/Styles';
import { getUser } from '../../../utils/helper';
import moment from 'moment';

const EditRequest = ({ navigation, route }) => {
    const request = route.params ? route.params.request : null

    const dispatch = useDispatch();
    const newPatient = route.params?.newPatient || null;
    const staff = route.params?.staff || '';
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({

        milkRequested: '',
    });
    const [open, setOpen] = useState(false);
    const [patientItems, setPatientItems] = useState([]);
    const [patients, setPatients] = useState([]);



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
        const { milkRequested } = formData;

        if (!milkRequested) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }



        const updatedRequest = {
            id: request._id,
            volume: formData.milkRequested,
        };

        dispatch(updateRequest(updatedRequest)).then((res)=>{
            Alert.alert("Success", "Request Confirmed Successfully");
            console.log(res.payload.request);
                        navigation.navigate('superadmin_fridges', {request: res.payload.request});
        })
        
        
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <KeyboardAvoidingView
            style={SuperAdmin.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Confirm Request Amount</Text>
            {request ? (
                <>
                    <View style={styles.section}>
                        <Text style={styles.requestTitleText}>Request to be completed...</Text>
                        <Text style={styles.requestText}>Requested Date: {formatDate(request.date)}</Text>
                        <Text style={styles.requestText}>Patient Name: {request.patient.name}</Text>
                        <Text style={styles.requestText}>Reason: {request.reason}</Text>
                        <Text style={styles.requestText}>Diagnosis: {request.diagnosis}</Text>
                        <Text style={styles.requestText}>Requested Volume: {request.volume} mL/day</Text>
                    </View>
                </>
            ) : <></>}
            <SafeAreaView style={styles.form}>

                <TextInput
                    style={styles.input}
                    placeholder="Volume of Milk Approved (mL/day)"
                    keyboardType="numeric"
                    value={formData.milkRequested}
                    onChangeText={(text) => handleChange('milkRequested', text)}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Confirm Request</Text>
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
        backgroundColor: '#4CAF50',
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
    requestText: {
        textAlign: 'left',
        color: '#999',
        marginVertical: 8,
        fontSize: 16
    },
    requestTitleText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 8,
        fontWeight: 'bold',
        fontSize: 18
    },
});

export default EditRequest;