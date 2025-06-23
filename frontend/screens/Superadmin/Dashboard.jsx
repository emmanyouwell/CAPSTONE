import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SuperAdmin } from "../../styles/Styles";
import Header from "../../components/Superadmin/Header";
import MenuGrid from "../../components/Superadmin/MenuGrid";
import { getUserDetails } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={SuperAdmin.headerText}>Dashboard</Text>
      <MenuGrid />
    </View>
  );
};

export default Dashboard;
