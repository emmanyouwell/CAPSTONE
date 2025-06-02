import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Superadmin/Header";
import { SuperAdmin } from "../../../styles/Styles";
import { patientHospital } from "../../../redux/actions/metricActions";
import { PieChart } from "react-native-chart-kit";

const PatientsPerHospital = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { patientPerHospital, loading, error } = useSelector(
    (state) => state.metrics
  );

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(patientHospital())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const pieChartData = patientPerHospital
    ? Object.entries(patientPerHospital)
        .filter(([key]) => key !== "total")
        .map(([hospital, value], index) => ({
          name: `${hospital} (${value})`,
          population: value,
          color: pieColors[index % pieColors.length],
          legendFontColor: "#333",
          legendFontSize: 14,
        }))
    : [];

  const total = patientPerHospital?.total || 0;

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Patients Per Hospital</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.card}>
            <PieChart
              data={pieChartData}
              width={Dimensions.get("window").width - 64}
              height={240}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: () => "#333",
                strokeWidth: 2,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="70"
              absolute
              hasLegend={false}
            />

            <View style={styles.legendContainer}>
              {pieChartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.totalText}>
              Total Patients: <Text style={styles.totalHighlight}>{total}</Text>
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const pieColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#8BC34A",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#E91E63",
  "#4CAF50",
  "#3F51B5",
];

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 30,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 30,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  legendContainer: {
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 15,
    color: "#333",
    flexShrink: 1,
  },
  totalText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    color: "#333",
  },
  totalHighlight: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default PatientsPerHospital;