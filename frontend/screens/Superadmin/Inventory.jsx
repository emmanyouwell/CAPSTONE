import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../components/Superadmin/Header'; // Import Header
import { SuperAdmin } from '../../styles/Styles';

const InventoryScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    return (
        <View style={SuperAdmin.container}>
            <Header/>

            <Text style={styles.screenTitle}>Inventory Management</Text>

            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('superadmin_fridges') }>
                    <Text style={styles.buttonText}>Refrigerator Inventory</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('superadmin_equipment')}>
                    <Text style={styles.buttonText}>Equipment Inventory</Text>
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

export default InventoryScreen;
