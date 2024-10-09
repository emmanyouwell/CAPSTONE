// MenuItem.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SuperAdminMenuItem } from '../../styles/Styles';
const styles = SuperAdminMenuItem;
const MenuItem = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};


export default MenuItem;
