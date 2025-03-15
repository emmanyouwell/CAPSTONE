import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../../../components/Superadmin/Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';

const Attendance = ({route, navigation}) => {
    const { item } = route.params;
    console.log("Milk Letting: ", item)
    const [step, setStep] = useState(1);
    const [donorType, setDonorType] = useState('');
    const [donorName, setDonorName] = useState('');
    const [volumeDonated, setVolumeDonated] = useState('');

    const handleNewDonor = () => {
        // Redirect to web interview form
        // For demo purpose, we'll skip to the next step
        console.log("Redirecting to Interview Form");
        setStep(2);
    };

    const handlePastDonor = () => setStep(2);
    const handleEligibility = (eligible) => eligible ? setStep(3) : setStep(1);

    const handleSubmit = () => {
        console.log({ donorName, donorType, volumeDonated });
        setDonorName('');
        setVolumeDonated('');
        setStep(1); // Return to the first step for new attendee
    };

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

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={styles.screenTitle}>Attendance</Text>
            {step === 1 && (
                <View style={styles.navButtons}>
                    <Text style={styles.title}>Are you a New or Past Donor?</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { setDonorType('New Donor'); handleNewDonor(); }}>
                        <Text style={styles.buttonText}>New Donor</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { setDonorType('Past Donor'); handlePastDonor(); }}>
                        <Text style={styles.buttonText}>Past Donor</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 2 && (
                <View style={styles.navButtons}>
                    <Text style={styles.title}>Are you eligible to donate?</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleEligibility(true)}>
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleEligibility(false)}>
                        <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 3 && (
                <View style={styles.form}>
                    <Text style={styles.title}>Enter Donor Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Donor's Name"
                        value={donorName}
                        onChangeText={setDonorName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Volume Donated (ml)"
                        keyboardType='numeric'
                        value={volumeDonated}
                        onChangeText={setVolumeDonated}
                    />
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    navButtons: {
        flex: 1,
        justifyContent: 'center', // Center buttons vertically
        alignItems: 'center', // Align buttons horizontally
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: '#E53777',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%', // Set button width to 80% of the screen width
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
        paddingHorizontal: 16,
    },
});

export default Attendance;