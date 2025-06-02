import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import { getAllSchedules } from "../../../redux/actions/scheduleActions";
import { SuperAdmin } from "../../../styles/Styles";
import Schedules from "./Schedules";

const HistorySchedules = ({ navigation }) => {
  const dispatch = useDispatch();
  const { schedules, error, loading } = useSelector((state) => state.schedules);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllSchedules())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const filteredSchedules = schedules.filter(
    (sched) => sched.status && sched.status === "Completed"
  );

  return (
    <View style={SuperAdmin.container}>
      {/* Header Component */}
      <Header/>

      <Text style={styles.screenTitle}>Schedule History</Text>

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
              <Text style={styles.errorText}>
                A problem occur in loading the data. Please refresh the screen
              </Text>
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
});

export default HistorySchedules;
