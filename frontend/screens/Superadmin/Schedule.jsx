import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Superadmin/Header";
import { logoutUser } from "../../redux/actions/userActions";
import { getAllSchedules } from "../../redux/actions/scheduleActions";
import { SuperAdmin } from "../../styles/Styles";
import Schedules from "../../components/Superadmin/Schedule/Schedules";
import { resetError } from "../../redux/slices/scheduleSlice";

const Schedule = ({ navigation }) => {
  const dispatch = useDispatch();
  const { schedules, error, loading } = useSelector((state) => state.schedules);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAllSchedules());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      dispatch(resetError());
    }
  }, [error]);
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllSchedules())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.navigate("login");
      })
      .catch((err) => console.log(err));
  };

  const filteredSchedules = schedules.filter(
    (sched) => sched.status && sched.status !== "Completed"
  );
  
  return (
    <View style={SuperAdmin.container}>
      {/* Header Component */}
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <Text style={styles.screenTitle}>Schedules Management</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("HistoryLetting")}
        >
          <Text style={styles.buttonText}>
            <MaterialIcons name="history" size={16} color="white" /> History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <SafeAreaView style={styles.form}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Schedules data={filteredSchedules} />
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
  navButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Schedule;
