import React, { useEffect, useState, startTransition, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Header from "../../../components/Superadmin/Header";
import { SuperAdmin } from "../../../styles/Styles";
import { getLettingDetails } from "../../../redux/actions/lettingActions";

const MilkLettingDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id } = route.params;

  const { lettingDetails, loading, success } = useSelector(
    (state) => state.lettings
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getLettingDetails(id));
    }
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getLettingDetails(id))
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  return (
    <View style={SuperAdmin.container}>
      <Header/>

      <Text style={styles.screenTitle}>Milk Letting Details</Text>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <SafeAreaView style={styles.form}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {lettingDetails.activity}
                </Text>
                <Text>Venue: {lettingDetails.venue}</Text>
                <Text>
                  Date:{" "}
                  {moment(lettingDetails?.actDetails?.start).format(
                    "MMMM Do YYYY"
                  )}
                </Text>
                <Text>Status: {lettingDetails.status}</Text>
                <Text style={styles.totalVolume}>
                  Total volume: {lettingDetails.totalVolume} mL
                </Text>
              </View>

              {/* Donor Attendance Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Donors Attendance</Text>
                {lettingDetails?.attendance?.map((donor, index) => (
                  <View key={donor._id} style={styles.donorCard}>
                    <Text style={styles.donorName}>
                      {donor.donor.user.name.first}{" "}
                      {donor.donor.user.name.middle}{" "}
                      {donor.donor.user.name.last}
                    </Text>
                    <Text>Donor Type: {donor.donorType}</Text>
                    <Text>
                      Address: {donor.donor.home_address.street},{" "}
                      {donor.donor.home_address.brgy},{" "}
                      {donor.donor.home_address.city}
                    </Text>
                    <Text>
                      Total Volume Collected:{" "}
                      {donor.bags.reduce((total, bag) => total + bag.volume, 0)}{" "}
                      mL
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </SafeAreaView>
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
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  donorCard: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  totalVolume: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  finalizeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MilkLettingDetails;