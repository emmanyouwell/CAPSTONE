import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { deleteEquipments } from '../../../../redux/actions/equipmentActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Equipments = ({ data }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isDeleted } = useSelector((state) => state.equipments);

    const handleEdit = (item) => {
        navigation.navigate('EditEquipment', { item });
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this equipment?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteEquipments(id))
                            .then(Alert.alert("Deleted", "Equipment deleted successfully."))
                            .catch((err) => Alert.alert('Error', err.message));;
                    },
                },
            ]
        );
    };

    const renderRightActions = (item) => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
            >
                <MaterialIcons name="edit" size={30} color="white" /> 
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item._id)}
            >
                <MaterialIcons name="delete" size={30} color="white" /> 
            </TouchableOpacity>
        </View>
    );

    const renderEquipment = ({ item }) => {
        const { name, equipType, condition, location, quantity, images } = item;

        return (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
                <View style={styles.card}>
                    {images && images.length > 0 ? (
                        <Image source={{ uri: images[0].url }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}

                    <View style={styles.info}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.details}>Type: {equipType}</Text>
                        <Text style={styles.details}>Condition: {condition}</Text>
                        <Text style={styles.details}>Location: {location}</Text>
                        <Text style={styles.details}>Quantity: {quantity}</Text>
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
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Equipments;