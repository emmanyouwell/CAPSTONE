import React, { useState, useEffect } from 'react'


import { SafeAreaView, Text, Button, StyleSheet, Platform, StatusBar, ImageBackground, View, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { loginStyle } from '../styles/Styles';
import { divider } from '../styles/Styles';
const screenWidth = Dimensions.get('window').width;
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout } from '../redux/actions/userActions';
import { viewAsyncStorage } from '../utils/helper';
import { resetError } from '../redux/slices/userSlice';
const EmployeeLogin = ({ navigation }) => {
    const dispatch = useDispatch();
    const [employeeID, setEmployeeID] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, userDetails, loading, error } = useSelector((state) => state.users);
    const handleFormSubmit = () => {
        // Handle form submission logic here
        console.log('Form submitted:', { employeeID, password });
        dispatch(loginUser({ employeeID, password, isEmp: true }));
    };
    useEffect(()=>{
        console.log(viewAsyncStorage());
    }, []);

    useEffect(()=>{
        if (isLoggedIn) {
            navigation.replace('superadmin_dashboard');
        }
    },[isLoggedIn])
    useEffect(()=>{
        if (error){
            dispatch(resetError());
            Alert.alert('Error', error);
        }
    },[error])
    return (
        <ImageBackground source={require('../assets/image/milk-letting-event-1.jpg')} imageStyle={styles.backgroundImageStyle} style={styles.backgroundImage}>
            <LinearGradient
                colors={['#F05A7E', '#080607']}
                style={styles.overlay}
            />
            <SafeAreaView style={styles.container}>
                {loading && <Text>Loading...</Text>}
                {/* {error && <Text style={styles.error}>{error}</Text>} */}
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
                                    placeholder="Employee ID"
                                    placeholderTextColor="#000"
                                    value={employeeID}
                                    onChangeText={setEmployeeID}
                                    keyboardType="number-pad"
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
                                <Text style={divider.dividerText}>User Sign in</Text>
                                <View style={divider.divider} />
                            </View>
                            <Button title="Sign in with email" onPress={() => navigation.replace('login')} />

                        </LinearGradient>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}
const styles = loginStyle;
export default EmployeeLogin