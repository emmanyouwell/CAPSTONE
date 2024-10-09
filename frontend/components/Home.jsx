import React from 'react'
import {View, Text, Button, TouchableOpacity} from 'react-native'
import { defaultStyle, buttonStyle, loginStyle } from '../styles/Styles'
const Home = ({navigation}) => {
  return (
    <View style={defaultStyle.container}>
        <Text>Development Home</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('login')} style={buttonStyle.defaultBtn}><Text style={buttonStyle.btnText}>Login</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('superadmin_dashboard')} style={buttonStyle.defaultBtn}><Text style={buttonStyle.btnText}>Dashboard</Text></TouchableOpacity>
    </View>
  )
}

export default Home