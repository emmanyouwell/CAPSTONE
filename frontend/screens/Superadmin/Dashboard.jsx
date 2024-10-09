import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { defaultStyle, SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import MenuGrid from '../../components/Superadmin/MenuGrid'
const Dashboard = ({navigation}) => {
    const onMenuPress = () => {

    }
    const onLogoutPress = () => {

    }
    return (
        <View style={defaultStyle.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress}/>
            <Text style={SuperAdmin.headerText}>Admin Dashboard</Text>
            <MenuGrid/>
        </View>
    )
}

export default Dashboard