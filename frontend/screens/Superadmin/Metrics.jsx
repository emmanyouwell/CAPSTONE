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
import { useDispatch, useSelector } from "react-redux";
import {
  getMilkPerMonth,
  getDonorsPerMonth,
  getDispensedMilkPerMonth,
  getPatientsPerMonth,
  getRequestsPerMonth,
  getAvailableMilk,
  getExpiringMilk,
  donationLocation,
  donorLocation,
  patientHospital,
} from "../../redux/actions/metricActions";

const Metrics = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const {
    stats,
    dispensedMilk,
    error,
    monthlyDonors,
    monthlyPatients,
    monthlyRequests,
    availableMilk,
    expiringMilk,
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
          dispatch(getAvailableMilk()),
          dispatch(getExpiringMilk()),
          dispatch(donationLocation()),
          dispatch(donorLocation()),
          dispatch(patientHospital()),
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
      dispatch(getAvailableMilk()),
      dispatch(getExpiringMilk()),
      dispatch(donationLocation()),
      dispatch(donorLocation()),
      dispatch(patientHospital()),
    ]).finally(() => setRefreshing(false));
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
      icon: "bottle-tonic",
      route: "DispensedPerMonth",
    },
    {
      id: "5",
      title: "Total Requests",
      subtitle: `${monthlyRequests?.total?.total ?? 0}`,
      icon: "clipboard-text",
      route: "RequestsPerMonth",
    },
    {
      id: "6",
      title: "Donations Per Baranggay",
      icon: "map-marker-radius",
      route: "DonationsPerBrgy",
    },
    {
      id: "7",
      title: "Donors Per Baranggay",
      icon: "map-marker-account",
      route: "DonorsPerBrgy",
    },
    {
      id: "8",
      title: "Patients Per Hospital",
      icon: "hospital-building",
      route: "PatientsPerHospital",
    },
    {
      id: "9",
      title: "Pasteurized Milk Avail",
      subtitle: `${availableMilk ?? 0}`,
      icon: "bottle-tonic-plus",
      disable: true,
    },
    {
      id: "10",
      title: "Pasteurize Soon",
      subtitle: `${((expiringMilk ?? 0) / 1000).toFixed(2)} L`,
      icon: "timer-sand",
      disable: true,
    },
  ];

  const renderItem = (item) => (
    <View style={metricsStyle.cardContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate(item.route)}
        disabled={item.disable}
      >
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
      <Header />
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
