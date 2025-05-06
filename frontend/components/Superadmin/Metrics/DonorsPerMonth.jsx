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
import { getDonorsPerMonth } from '../../../redux/actions/metricActions';
import { BarChart } from 'react-native-chart-kit';

const DonorsPerMonth = ({ navigation }) => {
    const dispatch = useDispatch();

    const { monthlyDonors, loading, error } = useSelector((state) => state.metrics);

    useEffect(() => {
        dispatch(getDonorsPerMonth());
    }, [dispatch]);

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser()
            .then(() => navigation.navigate('login'))
            .catch((err) => console.log(err))
        );
    };

    const chartLabels = Object.keys(monthlyDonors).filter((key) => key !== 'total'); 
    const privateData = chartLabels.map((month) => (monthlyDonors[month]?.private || 0) );
    const communityData = chartLabels.map((month) => (monthlyDonors[month]?.community || 0) );

    const communityTotal = (monthlyDonors.total?.community || 0) ; 
    const privateTotal = (monthlyDonors.total?.private || 0) ; 
    const overallTotal = (monthlyDonors.total?.total || 0);

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

            <Text style={styles.screenTitle}>Donors Per Month Charts</Text>

            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <ScrollView>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Private Donors</Text>
                        <BarChart
                        data={{
                            labels: chartLabels, 
                            datasets: [
                                {
                                    data: privateData.flat(), 
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 32}
                        height={300}
                        yAxisLabel=""
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
                           Total: {privateTotal} Donors
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Community Donors</Text>
                        <BarChart
                        data={{
                            labels: chartLabels, 
                            datasets: [
                                {
                                    data: communityData.flat(), 
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 32}
                        height={300}
                        yAxisLabel=""
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
                           Total: {communityTotal} Donors
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Overall Total: {overallTotal} Donors
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

export default DonorsPerMonth;