import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SuperAdminHeader } from "../../styles/Styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const styles = SuperAdminHeader;
const Header = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onMenuPress = () => {
    navigation.openDrawer();
  };
  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.replace("login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <View style={SuperAdminHeader.stickyHeader}>
      <View style={styles.headerContainer}>
        {/* Left: Hamburger Menu */}
        <TouchableOpacity onPress={onMenuPress}>
          <Icon name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Center: Logo and System Name */}
        <View style={styles.centerContainer}>
          <Image
            source={require("../../assets/image/logo.png")} // Replace with your logo path
            style={styles.logo}
          />
          <Text style={styles.systemName}>TCHMB Portal</Text>
        </View>

        {/* Right: Logout Icon */}
        <TouchableOpacity onPress={onLogoutPress}>
          <Icon name="log-out" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
