import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SuperAdmin } from '../../../styles/Styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Header from '../Header';
import { registerUser } from '../../../redux/actions/userActions';
import { resetRegister } from '../../../redux/slices/userSlice';
const CreateStaff = ({navigation}) => {
    const dispatch = useDispatch();
    const {isRegistered, loading, error} = useSelector((state) => state.users);
    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        first: Yup.string()
            .required('First name is required')
            .min(3, 'First name must be at least 3 characters'),
        middle: Yup.string()
            .required('Middle name is required')
            .min(3, 'Middel name must be at least 3 characters'),
        last: Yup.string()
            .required('Last name is required')
            .min(3, 'Last name must be at least 3 characters'),
        employeeID: Yup.string()
            .required('Employee ID Number is required')
            .matches(/^[0-9]+$/, 'Phone number must only contain digits'),
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
            <Header/>
            <Text style={SuperAdmin.headerText}>Create Staff</Text>
            <Formik
                initialValues={{
                    employeeID: '',
                    first: '',
                    middle: '',
                    last: '',
                    email: '',
                    phone: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    
                    const formData = {
                        firstName: values.first, 
                        middleName: values.middle, 
                        lastName: values.last,
                        employeeID: Number(values.employeeID),
                        email: values.email,
                        phoneNumber: values.phone,
                        role: 'Staff',
                    }
                    console.log('Form Submitted', formData);
                    // Handle form submission logic here
                    dispatch(registerUser(formData));
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <ScrollView style={styles.container}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your first name"
                            onChangeText={handleChange('first')}
                            onBlur={handleBlur('first')}
                            value={values.first}
                        />
                        {touched.first && errors.first && <Text style={styles.errorText}>{errors.first}</Text>}
                        <Text style={styles.label}>Middle Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your middle name"
                            onChangeText={handleChange('middle')}
                            onBlur={handleBlur('middle')}
                            value={values.middle}
                        />
                        {touched.middle && errors.middle && <Text style={styles.errorText}>{errors.middle}</Text>}
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your last name"
                            onChangeText={handleChange('last')}
                            onBlur={handleBlur('last')}
                            value={values.last}
                        />
                        {touched.last && errors.last && <Text style={styles.errorText}>{errors.last}</Text>}
                        <Text style={styles.label}>Employee ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your employee ID number"
                            keyboardType="phone-pad"
                            onChangeText={handleChange('employeeID')}
                            onBlur={handleBlur('employeeID')}
                            value={values.employeeID}
                        />
                        {touched.employeeID && errors.employeeID && <Text style={styles.errorText}>{errors.employeeID}</Text>}

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
                        <View style={styles.container}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </ScrollView>
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