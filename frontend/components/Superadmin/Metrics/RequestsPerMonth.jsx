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
import { getRequestsPerMonth } from "../../../redux/actions/metricActions";
import { StackedBarChart } from "react-native-chart-kit";

const RequestsPerMonth = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { monthlyRequests, loading, error } = useSelector(
    (state) => state.metrics
  );

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getRequestsPerMonth()).finally(() => setRefreshing(false));
  };

  const chartLabels = Object.keys(monthlyRequests).filter(
    (key) => key !== "total" && key !== "pending"
  );

  const chartData = chartLabels.map((month) => [
    monthlyRequests[month]?.inpatient || 0,
    monthlyRequests[month]?.outpatient || 0,
  ]);

  const inpatientTotal = monthlyRequests.total?.inpatient || 0;
  const outpatientTotal = monthlyRequests.total?.outpatient || 0;
  const overallTotal = monthlyRequests.total?.total || 0;

  return (
    <View style={SuperAdmin.container}>
      <Header />

      <Text style={styles.screenTitle}>Requests Per Month</Text>

      {loading && !refreshing ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Request Comparison</Text>
            <StackedBarChart
              data={{
                labels: chartLabels,
                legend: ["Inpatient", "Outpatient"],
                data: chartData,
                barColors: ["#4e73df", "#f6c23e"],
              }}
              width={Dimensions.get("window").width - 32}
              height={320}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#f5f5f5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              hideLegend={false}
              fromZero
            />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Overall Summary</Text>
            <Text style={styles.summaryItem}>
              🏠 Inpatients: {inpatientTotal}
            </Text>
            <Text style={styles.summaryItem}>
              🌱 Outpatients: {outpatientTotal}
            </Text>
            <Text style={styles.summaryTotal}>
              👥 Total Recipients: {overallTotal}
            </Text>
          </View>
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
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
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
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    alignSelf: "center",
  },
  totalVolume: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: "#e6f0fa",
    borderRadius: 12,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2b3e50",
  },
  summaryItem: {
    fontSize: 16,
    marginVertical: 2,
    color: "#2b3e50",
  },
  summaryTotal: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: "#1a2e45",
  },
});

export default RequestsPerMonth;
