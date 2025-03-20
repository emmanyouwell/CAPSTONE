import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLetting } from '../../../redux/actions/lettingActions'

import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native'
import Header from '../Header'
import { logoutUser, getUserDetails } from '../../../redux/actions/userActions'
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { SuperAdmin, buttonStyle } from '../../../styles/Styles'
import { getUser } from '../../../utils/helper'
import { resetSuccess } from '../../../redux/slices/lettingSlice'

const AddMilkLetting = ({ navigation }) => {

    const [open, setOpen] = useState(false); // Whether the dropdown is open
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDateOpen, setEndDateOpen] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const handleStartConfirm = () => {
        setStartDateOpen(false);
    };
    const handleEndConfirm = () => {
        setEndDateOpen(false);
    }

    const dispatch = useDispatch();
    const { success, loading, error } = useSelector(state => state.events);
    const { userDetails } = useSelector(state => state.users);
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {
        dispatch(logoutUser()).then(() => { navigation.replace('login') }).catch((err) => console.log(err))
    }

    const validationSchema = Yup.object({
        activity: Yup.string()
            .required("Activity is required"),

        venue: Yup.string()
            .required("Venue is required"),

        start: Yup.date()
            .required("Start date is required")
            .typeError("Start date is invalid"),

        end: Yup.date()
            .required("End date is required")
            .typeError("End date is invalid")
            .min(Yup.ref("start"), "End date must be after start date"),
    });


    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch])
    useEffect(() => {
        if (success) {
            dispatch(resetSuccess());
            navigation.navigate('superadmin_milkLetting')
        }
    }, [dispatch, success])
    return (
        <>
            <Header onLogoutPress={handleLogoutClick} onMenuPress={handleMenuClick} />
            <View style={styles.container}>
                <Text style={SuperAdmin.headerText}>Add Milk Letting Event</Text>
                <View style={{ padding: 8 }}>
                    <Formik
                        initialValues={{ description: '', activity: '', venue: '', status: '', start: '', end: '', user: userDetails ? userDetails._id : '' }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            const localStart = new Date(values.start);
                            const localEnd = new Date(values.end);
                            const formData = {
                                activity: values.activity,
                                venue: values.venue,
                                description: values.description ? values.description : '',
                                actDetails: {
                                    start: localStart,
                                    end: localEnd,
                                },
                                admin: userDetails._id
                            }
                            dispatch(createLetting(formData));
                            navigation.navigate('superadmin_milkLetting')
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                            <View>
                                <Text>Event name</Text>
                                <TextInput
                                    placeholder="Enter name of activity"
                                    onChangeText={handleChange('activity')}
                                    onBlur={handleBlur('activity')}
                                    value={values.activity}
                                    style={styles.textInputStyle}
                                />
                                {errors.activity && touched.activity && <Text style={styles.errorText}>{errors.activity}</Text>}
                                <Text>Venue</Text>
                                <TextInput
                                    placeholder="Enter name of venue"
                                    onChangeText={handleChange('venue')}
                                    onBlur={handleBlur('venue')}
                                    value={values.venue}
                                    style={styles.textInputStyle}
                                />
                                <Text>Description</Text>
                                <TextInput
                                    placeholder="Description"
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                    style={styles.textAreaStyle}
                                    multiline={true} // Enable multiline
                                    numberOfLines={4} // Adjust the number of visible lines
                                />

                                {errors.status && touched.status && <Text style={styles.errorText}>{errors.status}</Text>}

                                <View>
                                    <Text>Start Date</Text>
                                    <TouchableOpacity
                                        onPress={() => setStartDateOpen(true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            padding: 10,
                                            borderRadius: 5,
                                            marginBottom: 10,
                                            backgroundColor: "#f0f0f0",
                                            marginVertical: 8,
                                        }}
                                    >
                                        <Text>{values.start ? moment(values.start).format('MMMM Do YYYY, h:mm:ss a') : "Select Start Date"}</Text></TouchableOpacity>
                                    {startDateOpen && (
                                        <>

                                            <DatePicker
                                                modal
                                                open={startDateOpen}
                                                date={startDate}
                                                onDateChange={(selectedDate) => setFieldValue('start', new Date(selectedDate).toISOString())}
                                                onConfirm={(selectedDate) => {
                                                    setFieldValue('start', new Date(selectedDate).toISOString());
                                                    handleStartConfirm();
                                                }}
                                                onCancel={handleStartConfirm}
                                                mode="datetime"  // You can use 'date' or 'time' here as well
                                            />

                                        </>
                                    )}


                                </View>
                                {errors.start && touched.start && <Text style={styles.errorText}>{errors.start}</Text>}
                                <View>
                                    <Text>End Date</Text>

                                    <TouchableOpacity
                                        onPress={() => setEndDateOpen(true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            padding: 10,
                                            borderRadius: 5,
                                            marginBottom: 10,
                                            backgroundColor: "#f0f0f0",
                                            marginVertical: 8
                                        }}
                                    >
                                        <Text >{values.end ? moment(values.end).format('MMMM Do YYYY, h:mm:ss a') : "Select End Date"}</Text></TouchableOpacity>
                                    {endDateOpen && (
                                        <>

                                            <DatePicker
                                                modal
                                                open={endDateOpen}
                                                date={endDate}

                                                onConfirm={(selectedDate) => {
                                                    setFieldValue('end', new Date(selectedDate).toISOString())
                                                    handleEndConfirm();
                                                }}
                                                onCancel={handleEndConfirm}
                                                mode="datetime"  // You can use 'date' or 'time' here as well
                                            />

                                        </>
                                    )}


                                </View>
                                {errors.end && touched.end && <Text style={styles.errorText}>{errors.end}</Text>}

                                <Button title="Submit" onPress={handleSubmit} />
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    selectedDate: {

        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
        borderColor: '#ccc'
    },
    dropdownContainer: {
        width: '100%',
        marginVertical: 8,
    },
    dropdown: {
        zIndex: 5000,
        backgroundColor: '#fafafa',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,

    },
    textInputStyle: {
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4
    },
    textAreaStyle: {
        height: 100,  // Adjust the height as needed
        padding: 8,
        marginVertical: 8,
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top', // Keeps the text aligned at the top of the input
    },
    errorText: {
        marginVertical: 4,
        color: 'red'
    }
})

export default AddMilkLetting