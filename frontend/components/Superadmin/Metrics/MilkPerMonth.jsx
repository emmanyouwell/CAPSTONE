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
import { getMilkPerMonth } from "../../../redux/actions/metricActions";
import { BarChart, StackedBarChart } from "react-native-chart-kit";

const MilkPerMonth = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { stats, loading, error } = useSelector((state) => state.metrics);

  useEffect(() => {
    dispatch(getMilkPerMonth());
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getMilkPerMonth()).finally(() => setRefreshing(false));
  };

  const chartLabels = Object.keys(stats).filter((key) => key !== "total");
  const privateData = chartLabels.map(
    (month) => (stats[month]?.private || 0) / 1000
  );
  const communityData = chartLabels.map(
    (month) => (stats[month]?.community || 0) / 1000
  );

  const stackedData = chartLabels.map((label, idx) => [
    communityData[idx],
    privateData[idx],
  ]);

  const communityTotal = (stats.total?.community || 0) / 1000;
  const privateTotal = (stats.total?.private || 0) / 1000;
  const overallTotal = (stats.total?.total || 0) / 1000;

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Milk Collection Overview</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Totals Summary Card */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Community</Text>
              <Text style={styles.summaryValue}>{communityTotal.toFixed(2)} L</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Private</Text>
              <Text style={styles.summaryValue}>{privateTotal.toFixed(2)} L</Text>
            </View>
            <View style={[styles.summaryCard, styles.overallCard]}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{overallTotal.toFixed(2)} L</Text>
            </View>
          </View>

          {/* Stacked Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Combined Donor Comparison</Text>
            <StackedBarChart
              data={{
                labels: chartLabels,
                legend: ["Community", "Private"],
                data: stackedData,
                barColors: ["#e74c3c", "#2980b9"],
              }}
              width={Dimensions.get("window").width - 32}
              height={300}
              yAxisSuffix=" L"
              chartConfig={chartConfig}
              style={styles.chart}
              decimalPlaces={1}
              fromZero
            />
          </View>

          {/* Private Donors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Private Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: privateData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={250}
              yAxisSuffix=" L"
              chartConfig={{
                ...chartConfig,
                fillShadowGradient: "#3498db",
              }}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>

          {/* Community Donors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: communityData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={250}
              yAxisSuffix=" L"
              chartConfig={{
                ...chartConfig,
                fillShadowGradient: "#e74c3c",
              }}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    alignSelf: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#ecf0f1",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  overallCard: {
    backgroundColor: "#dff9fb",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default MilkPerMonth;
