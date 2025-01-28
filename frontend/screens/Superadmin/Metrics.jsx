import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView } from 'react-native'
import Header from '../../components/Superadmin/Header'
import { SuperAdmin, metricsStyle, colors } from '../../styles/Styles'
import Cards from '../../components/Superadmin/Metrics/Cards';
import { logoutUser } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { getMilkPerMonth } from '../../redux/actions/donorActions';

const Metrics = ({navigation}) => {
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const { stats, loading, error } = useSelector((state) => state.donors);
    
    useEffect(() => {
            dispatch(getMilkPerMonth());
    }, [dispatch]);
    
    const cardData = [
        { id: '1', title: 'Revenue', subtitle: '100k', icon: 'cash-multiple', route: 'superadmin_donor_record' },
        { id: '2', title: 'Collected Milk', subtitle: `${stats.total?.total / 1000} L`, icon: 'baby-bottle', route: 'MilkPerMonth' },
        { id: '3', title: 'Recipient', subtitle: '7.4k', icon: 'account-heart', route: 'superadmin_donor_record' },
        { id: '4', title: 'Stored Milk', subtitle: '100', icon: 'baby-bottle', route: 'superadmin_donor_record' },
    ];
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    }

    const renderItem = (item) => (
        <View style={metricsStyle.cardContainer}>
            <TouchableOpacity 
            onPress={() => navigation.navigate(item.route)}>
                <Cards title={item.title} subtitle={item.subtitle} icon={item.icon} />
            </TouchableOpacity>
         </View>
    )

    if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            );
        }
    
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getMilkPerMonth())
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
            <Text style={styles.screenTitle}>Metrics</Text>
            <ScrollView style={{ padding: 10 }} 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>
                <FlatList
                    data={cardData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderItem(item)}
                    contentContainerStyle={metricsStyle.flatListContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={2} 
                    columnWrapperStyle={metricsStyle.columnWrapper}
                    ItemSeparatorComponent={() => <View style={metricsStyle.separator} />}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    }
});

export default Metrics