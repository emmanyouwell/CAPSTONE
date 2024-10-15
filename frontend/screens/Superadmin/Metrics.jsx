import React from 'react'
import { View, Text, FlatList, Image, ImageBackground, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header'
import DonorRecordsTable from '../../components/Superadmin/DonorRecordTable'
import { SuperAdmin, metricsStyle, colors } from '../../styles/Styles'
import donors from '../../assets/image/donors.jpg'
import Cards from '../../components/Superadmin/Metrics/Cards';
const Metrics = ({navigation}) => {
    const cardData = [
        { id: '1', title: 'Revenue', subtitle: '100k', icon: 'cash-multiple' },
        { id: '2', title: 'Donors', subtitle: '10.9k', icon: 'account-group' },
        { id: '3', title: 'Recipient', subtitle: '7.4k', icon: 'account-heart' },
        {id: '4', title: 'Stored Milk', subtitle: '100', icon: 'baby-bottle' },
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
            <Text>Metrics</Text>
            <View style={{ padding: 10 }}>
                <FlatList
                    data={cardData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={metricsStyle.cardContainer}>
                            <Cards title={item.title} subtitle={item.subtitle} icon={item.icon} />
                        </View>
                    )}
                    contentContainerStyle={metricsStyle.flatListContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={2} // Adjust the number of columns as needed
                    columnWrapperStyle={metricsStyle.columnWrapper}
                    ItemSeparatorComponent={() => <View style={metricsStyle.separator} />}
                />
            </View>
        </View>
    )
}

export default Metrics