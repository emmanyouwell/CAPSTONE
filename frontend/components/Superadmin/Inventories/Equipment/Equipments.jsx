import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

const Equipments = ({ data }) => {
    const renderEquipment = ({ item }) => {
        const { name, equipType, condition, location, quantity, images } = item;

        return (
            <View style={styles.card}>
                {/* Display the first image if available */}
                {images && images.length > 0 ? (
                    <Image source={{ uri: images[0].url }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}

                {/* Equipment details */}
                <View style={styles.info}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.details}>Type: {equipType}</Text>
                    <Text style={styles.details}>Condition: {condition}</Text>
                    <Text style={styles.details}>Location: {location}</Text>
                    <Text style={styles.details}>Quantity: {quantity}</Text>
                </View>
            </View>
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
});

export default Equipments;