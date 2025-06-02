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
import { BarChart } from "react-native-chart-kit";

const MilkPerMonth = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { stats, loading, error } = useSelector((state) => state.metrics);

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

  const communityTotal = (stats.total?.community || 0) / 1000;
  const privateTotal = (stats.total?.private || 0) / 1000;
  const overallTotal = (stats.total?.total || 0) / 1000;

  return (
    <View style={SuperAdmin.container}>
      <Header />

      <Text style={styles.screenTitle}>Milk Per Month Charts</Text>

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
          {/* Private Donors Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Private Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: privateData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={300}
              yAxisSuffix=" L"
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
              Total: {privateTotal.toFixed(2)} Liters
            </Text>
          </View>

          {/* Community Donors Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: communityData }],
              }}
              width={Dimensions.get("window").width - 32}
              height={300}
              yAxisSuffix=" L"
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
              Total: {communityTotal.toFixed(2)} Liters
            </Text>
          </View>

          {/* Overall Total */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Overall Total: {overallTotal.toFixed(2)} Liters
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
  totalsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
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

export default MilkPerMonth;
