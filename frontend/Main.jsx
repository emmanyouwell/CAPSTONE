import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './redux/slices/counterSlice';
import { SafeAreaView, Text, Button, StyleSheet, Platform, StatusBar, ImageBackground, View, Dimensions, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
const screenWidth = Dimensions.get('window').width;
const Main = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = () => {
        // Handle form submission logic here
        console.log('Form submitted:', { name, email, password });
    };
    return (
        <ImageBackground source={require('./assets/image/milk-letting-event-1.jpg')} imageStyle={styles.backgroundImageStyle} style={styles.backgroundImage}>
            <LinearGradient
                colors={['#F05A7E', '#080607']}
                style={styles.overlay}
            />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.headerLogin}>TCHMB Portal</Text>
                        <LinearGradient
                            colors={['#D00070', '#C91A84', '#7695FF']}
                            locations={[0.18, 0.50, 1]}
                            style={styles.circle}>

                            <View style={styles.form}>
                               
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#ccc"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#ccc"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <Button title="Submit" onPress={handleFormSubmit} />
                            </View>
                        </LinearGradient>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 0,
        

    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    bgColor: {
        backgroundColor: 'white',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'center',

    },
    backgroundImageStyle: {
        opacity: 1,
        zIndex: -2,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
        zIndex: -2,
    },
    circle: {
        position: 'absolute',
        bottom: 0,
        width: screenWidth,
        height: screenWidth + 20,
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150,
        marginTop: 20,
        zIndex: -1,
        padding: 50,

    },
    headerLogin: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        zIndex: 99,
        // marginTop: (screenWidth + 200) / 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        textShadowColor: 'rgba(0, 0, 0, 1)', // Shadow color
        textShadowOffset: { width: -2, height: 3 }, // Shadow offset
        textShadowRadius: 5, // Shadow blur radius
    },
    form: {
        marginVertical: 20,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },

})
export default Main