import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Header from "../../components/Superadmin/Header";
import { SuperAdmin, metricsStyle, colors } from "../../styles/Styles";
import Cards from "../../components/Superadmin/Metrics/Cards";
import { logoutUser } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import {
  getMilkPerMonth,
  getDonorsPerMonth,
  getDispensedMilkPerMonth,
  getPatientsPerMonth,
  getRequestsPerMonth,
} from "../../redux/actions/metricActions";

const Metrics = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(true); // local loading state

  const {
    stats,
    dispensedMilk,
    error,
    monthlyDonors,
    monthlyPatients,
    monthlyRequests,
  } = useSelector((state) => state.metrics);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getMilkPerMonth()),
          dispatch(getDonorsPerMonth()),
          dispatch(getDispensedMilkPerMonth()),
          dispatch(getPatientsPerMonth()),
          dispatch(getRequestsPerMonth()),
        ]);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(getDonorsPerMonth()),
      dispatch(getMilkPerMonth()),
      dispatch(getDispensedMilkPerMonth()),
      dispatch(getPatientsPerMonth()),
      dispatch(getRequestsPerMonth()),
    ])
      .finally(() => setRefreshing(false));
  };

  const handleMenuClick = () => {
    navigation.openDrawer();
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser())
      .then(() => navigation.navigate("login"))
      .catch((err) => console.log(err));
  };

  const cardData = [
    {
      id: "1",
      title: "Total Donors",
      subtitle: `${monthlyDonors?.total?.total ?? 0}`,
      icon: "account-group",
      route: "DonorsPerMonth",
    },
    {
      id: "2",
      title: "Total Milk Collected",
      subtitle: `${((stats?.total?.total ?? 0) / 1000).toFixed(2)} L`,
      icon: "baby-bottle",
      route: "MilkPerMonth",
    },
    {
      id: "3",
      title: "Total Recipient",
      subtitle: `${monthlyPatients?.total?.total ?? 0}`,
      icon: "account-heart",
      route: "PatientsPerMonth",
    },
    {
      id: "4",
      title: "Total Milk Released",
      subtitle: `${((dispensedMilk?.total?.total ?? 0) / 1000).toFixed(2)} L`,
      icon: "baby-bottle",
      route: "DispensedPerMonth",
    },
    {
      id: "5",
      title: "Total Requests",
      subtitle: `${monthlyRequests?.total?.total ?? 0}`,
      icon: "baby-bottle",
      route: "RequestsPerMonth",
    },
  ];

  const renderItem = (item) => (
    <View style={metricsStyle.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate(item.route)}>
        <Cards title={item.title} subtitle={item.subtitle} icon={item.icon} />
      </TouchableOpacity>
    </View>
  );

  if (localLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={SuperAdmin.container}>
      <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
      <Text style={styles.screenTitle}>Metrics</Text>
      <ScrollView
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <FlatList
          data={cardData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
          contentContainerStyle={metricsStyle.flatListContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={metricsStyle.columnWrapper}
          ItemSeparatorComponent={() => <View style={metricsStyle.separator} />}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default Metrics;
