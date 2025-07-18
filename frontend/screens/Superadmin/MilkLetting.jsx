import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Superadmin/Header';
import { getLettings } from '../../redux/actions/lettingActions';
import { SuperAdmin } from '../../styles/Styles';
import MilkLettings from '../../components/Superadmin/MilkLetting/MilkLettings';
import { resetError, resetSuccess } from '../../redux/slices/lettingSlice';

const InventoryScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { lettings, error, loading }  = useSelector((state) => state.lettings);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getLettings());
        dispatch(resetError())
    }, [dispatch]);
    useEffect(()=>{
        if (error){
            dispatch(resetError())
        }
    },[error])
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(resetSuccess());
        dispatch(getLettings())
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const filteredLettings = lettings.filter(
        (lets) => lets.status && lets.status !== 'Done'
    );

    return (
        <View style={SuperAdmin.container}>
            {/* Header Component */}
            <Header/>

            <Text style={styles.screenTitle}>Milk Letting Management</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => navigation.navigate('HistoryLetting')}
                >
                <Text style={styles.buttonText}>
                <MaterialIcons name="history" size={16} color="white" /> History
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddMilkLetting')}
                >
                <Text style={styles.buttonText}>
                <MaterialIcons name="add" size={16} color="white" /> Add
                </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <SafeAreaView style={styles.form}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : error? (
                        <View style={styles.center}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <MilkLettings data={filteredLettings} />
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
});

export default InventoryScreen;
