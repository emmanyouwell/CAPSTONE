import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEvents } from '../../../redux/actions/eventActions'

import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native'
import Header from '../Header'
import { logoutUser, getUserDetails} from '../../../redux/actions/userActions'
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { SuperAdmin, buttonStyle } from '../../../styles/Styles'
import { getUser } from '../../../utils/helper'
import { resetSuccess } from '../../../redux/slices/eventSlice'

const AddEvent = ({ navigation }) => {
    
   
    const [open, setOpen] = useState(false); // Whether the dropdown is open
    const [startDateOpen, setStartDateOpen] = useState(false); // Whether the date picker is open
    const [startDate, setStartDate] = useState(new Date());
    const [endDateOpen, setEndDateOpen] = useState(false); // Whether the date picker is open
    const [endDate, setEndDate] = useState(new Date());
    const [items, setItems] = useState([  // Options in the dropdown
        { label: 'Not-Due', value: 'Not-Due' },
        { label: 'On-Going', value: 'On-Going' },
        { label: 'Done', value: 'Done' },

    ]);
    const handleStartConfirm = () => {

        setStartDateOpen(false);  // Close the picker after selection
    };
    const handleEndConfirm = () => {
        setEndDateOpen(false);  // Close the picker after selection
    }

    const dispatch = useDispatch();
    const { success, loading, error } = useSelector(state => state.events);
    const {userDetails} = useSelector(state => state.users);
    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {
        dispatch(logoutUser()).then(() => { navigation.replace('login') }).catch((err) => console.log(err))
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Title is required"),

        description: Yup.string(),

        status: Yup.string()
            .required("Status is required"),

        start: Yup.date()
            .required("Start date is required")
            .typeError("Start date is invalid"),

        end: Yup.date()
            .required("End date is required")
            .typeError("End date is invalid")
            .min(Yup.ref("start"), "End date must be after start date"),
    });


    useEffect(()=>{
        dispatch(getUserDetails());
    },[dispatch])
    useEffect(()=>{
        if (success){
            dispatch(resetSuccess());
            navigation.navigate('superadmin_schedules')
        }
    },[dispatch, success])
    return (
        <>
            <Header onLogoutPress={handleLogoutClick} onMenuPress={handleMenuClick} />
            <View style={styles.container}>
                <Text style={SuperAdmin.headerText}>Add Event</Text>
                <View style={{ padding: 8 }}>
                    <Formik
                        initialValues={{ title: '', description: '', status: '', start: '', end: '', user: userDetails ? userDetails._id : '' }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            const localStart = new Date(values.start);
                            const localEnd = new Date(values.end);
                            const formData = {
                                title: values.title,
                                description: values.description,
                                status: values.status,
                                start: localStart,
                                end:  localEnd,
                                user: userDetails._id
                            }
                            dispatch(addEvents(formData));
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                            <View>
                                <TextInput
                                    placeholder="Title"
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                    style={styles.textInputStyle}
                                />
                                {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}

                                <TextInput
                                    placeholder="Description"
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                    style={styles.textAreaStyle}
                                    multiline={true} // Enable multiline
                                    numberOfLines={4} // Adjust the number of visible lines
                                />
                                <DropDownPicker
                                    open={open}  // Controlled state for dropdown visibility
                                    value={values.status}  // Holds the selected value
                                    items={items}  // The list of items
                                    setOpen={setOpen}  // Function to update whether the dropdown is open
                                    setItems={setItems}  // Function to modify the list of items (optional)
                                    containerStyle={styles.dropdownContainer}
                                    style={styles.dropdown}  // Custom styles for the dropdown
                                    placeholder="Select an option"  // Placeholder text when no value is selected
                                    onSelectItem={(item) => {
                                        setFieldValue('status', item.value);  // Update the form field with the selected value
                                    }}

                                />


                                {errors.status && touched.status && <Text style={styles.errorText}>{errors.status}</Text>}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    <TouchableOpacity style={buttonStyle.defaultBtn} onPress={() => setStartDateOpen(true)}><Text style={{ color: 'white' }}>Start Date</Text></TouchableOpacity>
                                    <Text style={styles.selectedDate}>{values.start ? moment(values.start).format('MMMM Do YYYY, h:mm:ss a') : "Select Start Date"}</Text>
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
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    <TouchableOpacity style={buttonStyle.defaultBtn} onPress={() => setEndDateOpen(true)}><Text style={{ color: 'white' }}>End Date</Text></TouchableOpacity>
                                    <Text style={styles.selectedDate}>{values.end ? moment(values.end).format('MMMM Do YYYY, h:mm:ss a') : "Select End Date"}</Text>
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

export default AddEvent