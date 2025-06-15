import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SuperAdmin } from "../../styles/Styles";
import Header from "../../components/Superadmin/Header";
import MenuGrid from "../../components/Superadmin/MenuGrid";
import { getUserDetails } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { notifChecker } from "../../redux/actions/notifActions";
import { useNotification } from "../../context/NotificationContext";
const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { expoPushToken } = useNotification();
  const { userDetails } = useSelector((state) => state.users);
  const { notifDetails } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (expoPushToken && userDetails) {
      const data = {
        userId: userDetails._id,
        expoToken: expoPushToken,
      };
      dispatch(notifChecker(data));
    }
  }, [expoPushToken, userDetails, dispatch]);
console.log(notifDetails)
  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={SuperAdmin.headerText}>Dashboard</Text>
      <MenuGrid />
    </View>
  );
};

export default Dashboard;
