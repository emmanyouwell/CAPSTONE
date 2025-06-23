import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SuperAdminHeader } from "../../styles/Styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import {
  getUserNotifications,
  notifChecker,
} from "../../redux/actions/notifActions";
import { useNotification } from "../../context/NotificationContext";
import Notifications from "../Notifications";

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

  const { expoPushToken } = useNotification();
  const { userDetails } = useSelector((state) => state.users);
  const { unseen } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false); // for modal

  useEffect(() => {
    if (expoPushToken && userDetails) {
      const data = {
        userId: userDetails._id,
        expoToken: expoPushToken,
      };
      dispatch(notifChecker(data)).then(() => {
        dispatch(getUserNotifications());
      });
    }
  }, [expoPushToken, userDetails, dispatch]);

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
            source={require("../../assets/image/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.systemName}>TCHMB Portal</Text>
        </View>

        {/* Right: Notification Bell and Logout */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Notification Bell */}
          <TouchableOpacity
            onPress={() => setShowNotifications(true)}
            style={{ marginRight: 12 }}
          >
            <View>
              <Icon name="notifications-outline" size={26} color="#fff" />
              {unseen > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    backgroundColor: "blue",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    minWidth: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
                  >
                    {unseen}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Logout Icon */}
          <TouchableOpacity onPress={onLogoutPress}>
            <Icon name="log-out" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      {showNotifications && (
        <Notifications
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </View>
  );
};

export default Header;
