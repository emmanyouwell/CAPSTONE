import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Superadmin/Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { SuperAdmin } from '../../../styles/Styles';
import { getDispensedMilkPerMonth } from '../../../redux/actions/metricActions';
import { BarChart } from 'react-native-chart-kit';

const DispensedMilkPerMonth = ({ navigation }) => {
    const dispatch = useDispatch();

    const { dispensedMilk, loading, error } = useSelector((state) => state.metrics);

    useEffect(() => {
        dispatch(getDispensedMilkPerMonth());
    }, [dispatch]);

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser()
            .then(() => navigation.replace('login'))
            .catch((err) => console.log(err))
        );
    };

    // Prepare data for the chart (convert to liters)
    const chartLabels = Object.keys(dispensedMilk).filter((key) => key !== 'total'); 
    const inpatients = chartLabels.map((month) => (dispensedMilk[month]?.inpatient || 0) / 1000);
    const outpatients = chartLabels.map((month) => (dispensedMilk[month]?.outpatient || 0) / 1000);

    const outpatientTotal = (dispensedMilk.total?.outpatient || 0) / 1000; 
    const inpatientTotal = (dispensedMilk.total?.inpatient || 0) / 1000; 
    const overallTotal = (dispensedMilk.total?.total || 0) / 1000;

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Dispensed Milk Per Month</Text>

            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <ScrollView>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Inpatients Dispenses</Text>
                        <BarChart
                        data={{
                            labels: chartLabels, 
                            datasets: [
                                {
                                    data: inpatients.flat(), 
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 32}
                        height={300}
                        yAxisLabel=""
                        yAxisSuffix=" L" 
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#f7f7f7',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 0.5,
                            fillShadowGradient: 'blue',
                            fillShadowGradientOpacity: 1,
                        }}
                        style={styles.chart}
                        verticalLabelRotation={30}
                        fromZero
                        showBarTops
                        showValuesOnTopOfBars
                    />
                        <Text style={styles.totalVolume}>     
                           Total: {inpatientTotal.toFixed(2)} Liters
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Outpatient Dispenses</Text>
                        <BarChart
                        data={{
                            labels: chartLabels, 
                            datasets: [
                                {
                                    data: outpatients.flat(), 
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 32}
                        height={300}
                        yAxisLabel=""
                        yAxisSuffix=" L" 
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#f7f7f7',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 0.5,
                            fillShadowGradient: 'red',
                            fillShadowGradientOpacity: 1,
                        }}
                        style={styles.chart}
                        verticalLabelRotation={30}
                        fromZero
                        showBarTops
                        showValuesOnTopOfBars
                    />
                        <Text style={styles.totalVolume}>     
                           Total: {outpatientTotal.toFixed(2)} Liters
                        </Text>
                    </View>
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    section: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
    },
    chart: {
        marginVertical: 16,
        borderRadius: 16,
        alignSelf: 'center',
    },
    totalsContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    totalVolume: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        alignContent: 'center'
    },
});

export default DispensedMilkPerMonth;