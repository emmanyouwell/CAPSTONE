// MenuItem.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SuperAdminMenuItem } from '../../styles/Styles';
const styles = SuperAdminMenuItem;
const MenuItem = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};


export default MenuItem;
