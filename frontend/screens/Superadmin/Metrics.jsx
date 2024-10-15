import React from 'react'
import { View, Text, FlatList, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { SuperAdmin, metricsStyle, colors, sticky } from '../../styles/Styles'
import donors from '../../assets/image/donors.jpg'
import Cards from '../../components/Superadmin/Metrics/Cards';
import BarChart from '../../components/Superadmin/Metrics/BarChart';
const Metrics = ({ navigation }) => {
    const cardData = [
        { id: '1', title: 'Revenue', subtitle: '100k', icon: 'cash-multiple' },
        { id: '2', title: 'Stored Milk', subtitle: '100', icon: 'baby-bottle' },
        { id: '3', title: 'Donors', subtitle: '10.9k', icon: 'account-group' },
        { id: '4', title: 'Recipient', subtitle: '7.4k', icon: 'account-heart' },
        
        // Add more card data as needed
    ];
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {

    }
    return (
        
            <View>
                <Header onMenuPress={handleMenuClick} onLogoutPress={handleLogoutClick} />
                <View style={sticky.sticky}>
                <ScrollView>
                <Text style={SuperAdmin.headerText}>Metrics</Text>
                <View style={{ padding: 10 }}>
                    <View style={metricsStyle.gridContainer}>
                        {cardData.map((item) => (
                            <View key={item.id} style={metricsStyle.cardContainer}>
                                <Cards title={item.title} subtitle={item.subtitle} icon={item.icon} />
                            </View>
                        ))}
                    </View>
                </View>
                <View style={metricsStyle.container}>
                <View style={metricsStyle.chartContainer}>
                    <Text style={SuperAdmin.subHeaderText}>Bar Chart</Text>
                    <BarChart />
                </View>
                <View style={metricsStyle.chartContainer}>
                    <Text style={SuperAdmin.subHeaderText}>Bar Chart</Text>
                    <BarChart />
                </View>
                </View>
                </ScrollView>
                </View>
            </View>
        
    )
}

export default Metrics