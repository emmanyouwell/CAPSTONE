import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Superadmin/Header';
import { SuperAdmin } from '../../../styles/Styles';
import { getDonorsPerMonth } from '../../../redux/actions/metricActions';
import { BarChart } from 'react-native-chart-kit';

const DonorsPerMonth = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { monthlyDonors, loading, error } = useSelector((state) => state.metrics);

  useEffect(() => {
    dispatch(getDonorsPerMonth());
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getDonorsPerMonth()).finally(() => setRefreshing(false));
  };

  const chartLabels = Object.keys(monthlyDonors).filter((key) => key !== 'total');
  const privateData = chartLabels.map((month) => monthlyDonors[month]?.private || 0);
  const communityData = chartLabels.map((month) => monthlyDonors[month]?.community || 0);

  const communityTotal = monthlyDonors.total?.community || 0;
  const privateTotal = monthlyDonors.total?.private || 0;
  const overallTotal = monthlyDonors.total?.total || 0;

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Donors Per Month</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Private Donors Chart */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Private Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: privateData }],
              }}
              width={chartWidth}
              height={250}
              yAxisLabel=""
              chartConfig={chartConfig('#36A2EB')}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
              style={styles.chart}
            />
            <Text style={styles.totalVolume}>Total: {privateTotal} Donors</Text>
          </View>

          {/* Community Donors Chart */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Community Donors</Text>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: communityData }],
              }}
              width={chartWidth}
              height={250}
              yAxisLabel=""
              chartConfig={chartConfig('#FF6384')}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
              style={styles.chart}
            />
            <Text style={styles.totalVolume}>Total: {communityTotal} Donors</Text>
          </View>

          {/* Summary Section */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Overall Summary</Text>
            <Text style={styles.summaryItem}>🏠 Private Donors: {privateTotal}</Text>
            <Text style={styles.summaryItem}>🌱 Community Donors: {communityTotal}</Text>
            <Text style={styles.summaryTotal}>👥 Total Donors: {overallTotal}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const chartConfig = (barColor) => ({
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#f9f9f9',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  fillShadowGradient: barColor,
  fillShadowGradientOpacity: 1,
  barPercentage: 0.5,
  propsForBackgroundLines: {
    stroke: '#e3e3e3',
    strokeDasharray: '', // solid lines
  },
});

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  chartSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  chart: {
    borderRadius: 12,
  },
  totalVolume: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: '#e6f0fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2b3e50',
  },
  summaryItem: {
    fontSize: 16,
    marginVertical: 2,
    color: '#2b3e50',
  },
  summaryTotal: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#1a2e45',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});

export default DonorsPerMonth;
