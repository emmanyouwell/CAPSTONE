import React, { useState, useEffect } from 'react'


import { SafeAreaView, Text, Button, StyleSheet, Platform, StatusBar, ImageBackground, View, Dimensions, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { loginStyle } from '../styles/Styles';
import { divider } from '../styles/Styles';
const screenWidth = Dimensions.get('window').width;
const Login = ({navigation}) => {
   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = () => {
        // Handle form submission logic here
        console.log('Form submitted:', { email, password });
    };
    return (
        <ImageBackground source={require('../assets/image/milk-letting-event-1.jpg')} imageStyle={styles.backgroundImageStyle} style={styles.backgroundImage}>
            <LinearGradient
                colors={['#F05A7E', '#080607']}
                style={styles.overlay}
            />
            <SafeAreaView style={styles.container}>
            <Text style={styles.headerLogin}>TCHMB Portal</Text>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        
                        <LinearGradient
                            colors={['#D00070', '#C91A84', '#7695FF']}
                            locations={[0.18, 0.50, 1]}
                            style={styles.circle}>

                            <View style={styles.form}>
                               
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#000"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#000"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <Button title="Login" onPress={handleFormSubmit} />
                            </View>
                            <View style={divider.dividerContainer}>
                                <View style={divider.divider} />
                                <Text style={divider.dividerText}>or sign in with</Text>
                                <View style={divider.divider} />
                            </View>
                            <Button title="Google" onPress={() => console.log('Google sign in')} />
                            
                        </LinearGradient>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}
const styles = loginStyle;
export default Login