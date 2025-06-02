import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Superadmin/Header";
import { SuperAdmin } from "../../../styles/Styles";
import { getDispensedMilkPerMonth } from "../../../redux/actions/metricActions";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const DispensedMilkPerMonth = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { dispensedMilk, loading, error } = useSelector(
    (state) => state.metrics
  );

  const chartLabels = Object.keys(dispensedMilk)
    .filter((key) => key !== "total" && key !== "")
    .sort();

  const inpatients = chartLabels.map(
    (month) => (dispensedMilk[month]?.inpatient || 0) / 1000
  );
  const outpatients = chartLabels.map(
    (month) => (dispensedMilk[month]?.outpatient || 0) / 1000
  );

  const outpatientTotal = (dispensedMilk.total?.outpatient || 0) / 1000;
  const inpatientTotal = (dispensedMilk.total?.inpatient || 0) / 1000;
  const overallTotal = (dispensedMilk.total?.total || 0) / 1000;

  const isEmpty =
    chartLabels.length === 0 ||
    (inpatients.every((v) => v === 0) && outpatients.every((v) => v === 0));

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getDispensedMilkPerMonth()).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    dispatch(getDispensedMilkPerMonth());
  }, [dispatch]);

  return (
    <View style={SuperAdmin.container}>
      <Header />

      <Text style={styles.screenTitle}>Dispensed Milk Per Month</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4682B4" style={styles.centered} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.scrollContainer}
        >
          {isEmpty ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🥛</Text>
              <Text style={styles.emptyText}>No milk dispensed yet.</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Monthly Dispense Overview</Text>
              <BarChart
                data={{
                  labels: chartLabels,
                  datasets: [
                    { data: inpatients, color: () => "#4682B4" },
                    { data: outpatients, color: () => "#FF6347" },
                  ],
                  legend: ["Inpatients", "Outpatients"],
                }}
                width={screenWidth - 40}
                height={300}
                yAxisSuffix=" L"
                fromZero
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.5,
                }}
                style={styles.chart}
                verticalLabelRotation={30}
                showBarTops
                showValuesOnTopOfBars
              />

              <Text style={styles.summaryText}>
                🏥 Inpatient Total: <Text style={styles.value}>{inpatientTotal.toFixed(2)} L</Text>
              </Text>
              <Text style={styles.summaryText}>
                👪 Outpatient Total: <Text style={styles.value}>{outpatientTotal.toFixed(2)} L</Text>
              </Text>
              <Text style={styles.summaryText}>
                🧮 Overall Total: <Text style={[styles.value, styles.overall]}>{overallTotal.toFixed(2)} L</Text>
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  scrollContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fefefe",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  chart: {
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 16,
    marginTop: 8,
    color: "#444",
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
  overall: {
    color: "#008000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    margin: 20,
  },
  errorText: {
    color: "#cc0000",
    fontSize: 16,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
});

export default DispensedMilkPerMonth;
