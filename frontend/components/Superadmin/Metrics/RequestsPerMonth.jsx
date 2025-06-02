import React, { useEffect, useState, useCallback } from "react";
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
import { BarChart } from "react-native-chart-kit";

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
    (key) => key !== "total"
  );
  const inpatientData = chartLabels.map(
    (month) => monthlyRequests[month]?.inpatient || 0
  );
  const outpatientData = chartLabels.map(
    (month) => monthlyRequests[month]?.outpatient || 0
  );

  const outpatientTotal = monthlyRequests.total?.outpatient || 0;
  const inpatientTotal = monthlyRequests.total?.inpatient || 0;
  const overallTotal = monthlyRequests.total?.total || 0;

  return (
    <View style={SuperAdmin.container}>
      <Header />

      <Text style={styles.screenTitle}>Requests Per Month Charts</Text>

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
            <Text style={styles.sectionTitle}>Inpatients Requests</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: inpatientData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={300}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#f7f7f7",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.5,
                fillShadowGradient: "blue",
                fillShadowGradientOpacity: 1,
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              fromZero
              showBarTops
              showValuesOnTopOfBars
            />
            <Text style={styles.totalVolume}>
              Total: {inpatientTotal} Inpatient Requests
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outpatients Requests</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: outpatientData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={300}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#f7f7f7",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.5,
                fillShadowGradient: "red",
                fillShadowGradientOpacity: 1,
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              fromZero
              showBarTops
              showValuesOnTopOfBars
            />
            <Text style={styles.totalVolume}>
              Total: {outpatientTotal} Outpatients Requests
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Overall Total: {overallTotal} Requests
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
    alignContent: "center",
  },
});

export default RequestsPerMonth;
