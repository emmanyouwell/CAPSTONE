import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl, 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header';
import { logoutUser } from '../../redux/actions/userActions';
import { SuperAdmin } from '../../styles/Styles';
import { getStaffRequests } from '../../redux/actions/requestActions';
import Requests from '../../components/Staff/Requests';

const Requested = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.users);
    const { request, loading, error } = useSelector((state) => state.requests);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if(userDetails){
            dispatch(getStaffRequests(userDetails._id));
        }
    }, [dispatch, userDetails]);

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getStaffRequests(userDetails._id))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

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

    if (error) {
        return (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
    }

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>My requests</Text>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <SafeAreaView style={styles.form}>
                    {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <Requests data={request} />
                    // <Text>SAMPLE REQUESTS</Text>
                )}
                </SafeAreaView> 
            </ScrollView>

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
        flex: 1,
        paddingHorizontal: 16,
    },
    navButtons: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
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
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50', 
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        marginLeft: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3', 
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    errorText: {
        color: "red",
        fontSize: 16,
    },
});

export default Requested;