import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getFridges, deleteFridges } from '../../../redux/actions/fridgeActions';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Superadmin/Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';

const Refrigerator = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { fridge, loading, error } = useSelector((state) => state.fridges);

    useEffect(() => {
        dispatch(getFridges());
    }, [dispatch]);

    const handleNavigate = (fridge) => {
        navigation.navigate('FridgeDetails', { fridge });
    };

    const showEditDeleteOptions = (item) => {
        Alert.alert(
            "Edit or Delete Fridge",
            `What would you like to do with ${item.name}?`,
            [
                { text: "Edit", onPress: () => handleEdit(item) },
                { text: "Delete", onPress: () => handleDelete(item._id) },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };

    const handleEdit = (item) => {
        navigation.navigate('EditFridge', { fridge: item });
    };

    const handleDelete = (fridgeId) => {
        dispatch(deleteFridges(fridgeId))
            .then(() => {
                Alert.alert('Success', 'Fridge deleted successfully.');
                dispatch(getFridges()); // Refresh the list after deletion
            })
            .catch((err) => {
                Alert.alert('Error', 'Failed to delete the fridge.');
            });
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

    const renderFridgeCard = (item) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigate(item)} 
            onLongPress={() => showEditDeleteOptions(item)} 
            key={item._id}>
            <Text style={styles.fridgeName}>{item.name}</Text>
            <Text style={styles.fridgeCapacity}>Capacity: {item.capacity}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const pasteurizedFridges = fridge ? fridge.filter((f) => f.fridgeType === 'Pasteurized') : [];
    const unpasteurizedFridges = fridge ? fridge.filter((f) => f.fridgeType === 'Unpasteurized') : [];

    return (
        <ScrollView style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Refrigerator Management</Text>

            <Text style={styles.sectionTitle}>Pasteurized Fridges</Text>
            {pasteurizedFridges.length > 0 ? (
                <FlatList
                    data={pasteurizedFridges}
                    renderItem={({ item }) => renderFridgeCard(item)}
                    keyExtractor={(item) => item._id}
                    horizontal
                />
            ) : (
                <Text style={styles.noFridgeText}>No Pasteurized Fridges Available</Text>
            )}

            <Text style={styles.sectionTitle}>Unpasteurized Fridges</Text>
            {unpasteurizedFridges.length > 0 ? (
                <FlatList
                    data={unpasteurizedFridges}
                    renderItem={({ item }) => renderFridgeCard(item)}
                    keyExtractor={(item) => item._id}
                    horizontal
                />
            ) : (
                <Text style={styles.noFridgeText}>No Unpasteurized Fridges Available</Text>
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddFridge')}>
                <Text style={styles.addButtonText}>+ Add New Fridge</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: 200,
    },
    fridgeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fridgeCapacity: {
        fontSize: 14,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    noFridgeText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default Refrigerator;
