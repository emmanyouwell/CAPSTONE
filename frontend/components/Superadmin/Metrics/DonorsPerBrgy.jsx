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
import { donorLocation } from "../../../redux/actions/metricActions";
import { PieChart } from "react-native-chart-kit";

const DonorsPerBrgy = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { donorsPerBrgy, loading, error } = useSelector(
    (state) => state.metrics
  );

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(donorLocation())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const pieChartData = donorsPerBrgy
    ? Object.entries(donorsPerBrgy)
        .filter(([key]) => key !== "total")
        .map(([barangay, value], index) => ({
          name: `${barangay} (${value})`,
          population: value,
          color: pieColors[index % pieColors.length],
          legendFontColor: "#333",
          legendFontSize: 14,
        }))
    : [];

  const total = donorsPerBrgy?.total || 0;

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Donors Per Barangay</Text>

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
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={Dimensions.get("window").width - 64}
                height={240}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: () => "#333",
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="75"
                absolute
                hasLegend={false}
              />
            </View>

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
              Total: <Text style={styles.totalHighlight}>{total}</Text> Milk Donors
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
  scrollContainer: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 30,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 30,
  },
  card: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  legendContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingLeft: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#444",
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
    color: "#2196F3",
    fontWeight: "bold",
  },
});

export default DonorsPerBrgy;