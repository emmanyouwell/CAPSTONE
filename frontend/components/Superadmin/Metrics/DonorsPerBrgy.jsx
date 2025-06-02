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

  // Prepare pie chart data
  const pieChartData = donorsPerBrgy
    ? Object.entries(donorsPerBrgy)
        .filter(([key]) => key !== "total")
        .map(([barangay, value], index) => ({
          name: `${barangay} ${value}`,
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
        >
          <PieChart
            data={pieChartData}
            width={Dimensions.get("window").width - 16}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute // this shows raw value on chart but we’ll hide legend manually
            hasLegend={false} // disable default legend
            style={{ alignSelf: "center" }}
          />
          {pieChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}

          <Text style={styles.totalText}>
            Total: {total} Milk Donors
          </Text>
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
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    marginLeft: 20,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  totalText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
});

export default DonorsPerBrgy;