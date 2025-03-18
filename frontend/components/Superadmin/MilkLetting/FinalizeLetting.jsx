import React, { useEffect, useState, startTransition, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Header from "../../../components/Superadmin/Header";
import { logoutUser, getUserDetails} from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";
import { getUser } from "../../../utils/helper";
import {
  finalizeSession,
  getLettingDetails,
} from "../../../redux/actions/lettingActions";
import { recordPublicRecord } from "../../../redux/actions/collectionActions";
import { useFocusEffect } from "@react-navigation/native";

const FinalizeLetting = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;

  // const [userDetails, setUserDetails] = useState(null);
  const { userDetails } = useSelector((state) => state.users);
  const { lettingDetails, loading, success } = useSelector(
    (state) => state.lettings
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (item?._id) {
      dispatch(getLettingDetails(item._id));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   startTransition(() => {
  //     const fetchUserDetails = async () => {
  //       const user = await getUser();
  //       setUserDetails(user);
  //     };
  //     fetchUserDetails();
  //   });
  // }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserDetails());
    }, [dispatch]) // Only depends on `dispatch`
  );


  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getLettingDetails(item._id))
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const handleSubmit = () => {
    const submit = () => {
      if (!userDetails || !item) {
        Alert.alert("Error", "Something Went Wrong");
        return;
      }

      const finalizeData = {
        adminId: userDetails._id,
        lettingId: item._id,
      };

      dispatch(finalizeSession(finalizeData))
        .then(() => {
          dispatch(recordPublicRecord({ lettingId: item._id })).then(() => {
            Alert.alert("Success", `Milk Letting event has been finalized`);
            navigation.navigate("superadmin_milkLetting");
          });
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to add fridge. Please try again.");
          console.error(error);
        });
    };
    Alert.alert("Finalize", "Are you sure you want to finalize this event?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => submit() },
    ]);
  };

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
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <Text style={styles.screenTitle}>Finalize Milk Letting</Text>

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

              <TouchableOpacity
                style={styles.finalizeButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Finalize</Text>
              </TouchableOpacity>
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

export default FinalizeLetting;
