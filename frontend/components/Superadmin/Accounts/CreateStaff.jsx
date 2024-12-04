import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SuperAdmin } from '../../../styles/Styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Header from '../Header';
import { registerUser, logoutUser } from '../../../redux/actions/userActions';
import { resetRegister } from '../../../redux/slices/userSlice';
const CreateStaff = ({navigation}) => {
    const dispatch = useDispatch();
    const {isRegistered, loading, error} = useSelector((state) => state.users);
    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onLogoutPress = () => {
        dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
    }
    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]+$/, 'Phone number must only contain digits')
            .min(10, 'Phone number must be at least 10 digits'),
    });
    useEffect(()=>{
        if (isRegistered){
            console.log('User registered successfully');
            dispatch(resetRegister());
            navigation.navigate('superadmin_account_management');
        }
    },[dispatch, isRegistered, navigation])
    useEffect(() => {
        console.log('isRegistered changed:', isRegistered);
    }, [isRegistered]);
    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={SuperAdmin.headerText}>Create Staff</Text>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log('Form Submitted', values);
                    const formData = {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        phone: values.phone,
                        role: 'Staff',
                    }
                    // Handle form submission logic here
                    dispatch(registerUser(formData));
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.container}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                        />
                        {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            onChangeText={handleChange('phone')}
                            onBlur={handleBlur('phone')}
                            value={values.phone}
                        />
                        {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});
export default CreateStaff