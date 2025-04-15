import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../components/Superadmin/Header'; // Import Header
import { logoutUser } from '../../redux/actions/userActions';
import { SuperAdmin } from '../../styles/Styles';

const RequestOpt = ({ navigation }) => {
    const dispatch = useDispatch();

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

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Pending Request</Text>

            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Inpatients') }>
                    <Text style={styles.buttonText}>Inpatients</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Outpatients')}>
                    <Text style={styles.buttonText}>Outpatients</Text>
                </TouchableOpacity>
            </View>
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
});

export default RequestOpt;
