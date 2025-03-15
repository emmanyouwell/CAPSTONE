import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const MilkLettings = ({ data }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // const { isDeleted } = useSelector((state) => state.equipments);

    const handleEdit = (item) => {
        // navigation.navigate('EditEquipment', { item });
        console.log("Edit Milk Letting Event: ", item)
    };

    // const handleDelete = (id) => {
    //     Alert.alert(
    //         "Confirm Deletion",
    //         "Are you sure you want to delete this equipment?",
    //         [
    //             { text: "Cancel", style: "cancel" },
    //             {
    //                 text: "Delete",
    //                 style: "destructive",
    //                 onPress: () => {
    //                     dispatch(deleteEquipments(id))
    //                         .then(Alert.alert("Deleted", "Equipment deleted successfully."))
    //                         .catch((err) => Alert.alert('Error', err.message));;
    //                 },
    //             },
    //         ]
    //     );
    // };

    const renderRightActions = (item) => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
            >
                <MaterialIcons name="edit" size={30} color="white" /> 
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item._id)}
            >
                <MaterialIcons name="delete" size={30} color="white" /> 
            </TouchableOpacity> */}
        </View>
    );

    const renderLeftActions = (item) => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={[styles.actionButton, styles.attendButton]}
                onPress={() => navigation.navigate('Attendance', { item })}
            >
                <MaterialIcons name="group-add" size={30} color="white" /> 
            </TouchableOpacity>
        </View>
    );

    const renderEquipment = ({ item }) => {
        const { activity, venue, status, actDetails} = item;

        return (
            <Swipeable 
                renderRightActions={() => renderRightActions(item)} 
                renderLeftActions={() => renderLeftActions(item)}
            >
                <View style={styles.card}>

                    <View style={styles.info}>
                        <Text style={styles.title}>{activity}</Text>
                        <Text style={styles.details}>Venue: {venue}</Text>
                        <Text style={styles.details}>Status: {status}</Text>
                        <Text style={styles.details}>
                            Date: {moment(actDetails?.start).format('MMMM Do YYYY')}
                        </Text>
                        <Text style={styles.details}>
                            Time: {moment(actDetails?.start).format('h:mm A')} - {moment(actDetails?.end).format('h:mm A')}
                        </Text>
                    </View>
                </View>
            </Swipeable>
        );
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderEquipment}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    attendButton: {
        backgroundColor: '#E53777',
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MilkLettings;