import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SuperAdminHeader } from '../../styles/Styles';
const styles = SuperAdminHeader;
const Header = ({
    onMenuPress, onLogoutPress
}) => {
  return (
    <View style={styles.headerContainer}>
    {/* Left: Hamburger Menu */}
    <TouchableOpacity onPress={onMenuPress}>
      <Icon name="menu" size={30} color="#fff" />
    </TouchableOpacity>
    
    {/* Center: Logo and System Name */}
    <View style={styles.centerContainer}>
      <Image
        source={require('../../assets/image/logo.png')} // Replace with your logo path
        style={styles.logo}
      />
      <Text style={styles.systemName}>TCHMB Portal</Text>
    </View>
    
    {/* Right: Logout Icon */}
    <TouchableOpacity onPress={onLogoutPress}>
      <Icon name="log-out" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
  )
}

export default Header