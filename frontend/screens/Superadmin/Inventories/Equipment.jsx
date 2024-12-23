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
import Header from '../../../components/Superadmin/Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';

const InventoryScreen = ({ navigation }) => {
    const dispatch = useDispatch();

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
            {/* Header Component */}
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Equipment Management</Text>

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
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%', 
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InventoryScreen;
