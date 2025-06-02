import React, { useState } from "react";
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
import { donationLocation } from "../../../redux/actions/metricActions";
import { PieChart } from "react-native-chart-kit";

const DonationsPerBrgy = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { donationsPerBrgy, loading, error } = useSelector(
    (state) => state.metrics
  );

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(donationLocation())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const pieChartData = donationsPerBrgy
    ? Object.entries(donationsPerBrgy)
        .filter(([key]) => key !== "total")
        .map(([barangay, value], index) => ({
          name: `${barangay} (${(value / 1000).toFixed(2)} L)`,
          population: value,
          color: pieColors[index % pieColors.length],
          legendFontColor: "#333",
          legendFontSize: 14,
        }))
    : [];

  const total = (donationsPerBrgy?.total || 0) / 1000;

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Donations Per Barangay</Text>

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
              width={Dimensions.get("window").width - 40}
              height={240}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="75"
              absolute
              hasLegend={false}
              style={{ alignSelf: "center" }}
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
              Total Donated: <Text style={styles.totalHighlight}>{total.toFixed(2)} L</Text>
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const pieColors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800",
  "#9C27B0", "#00BCD4", "#E91E63", "#4CAF50", "#3F51B5",
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
    paddingBottom: 20,
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
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingLeft: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    color: "#333",
  },
  totalHighlight: {
    color: "#2196F3",
    fontWeight: "bold",
  },
});

export default DonationsPerBrgy;