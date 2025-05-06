import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEventDetails, editEvents, deleteEvents } from '../../../redux/actions/eventActions'
import { resetUpdate, resetDelete } from '../../../redux/slices/eventSlice'
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Alert } from 'react-native'
import Header from '../Header'
import { logoutUser, getUserDetails } from '../../../redux/actions/userActions'

import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { SuperAdmin, buttonStyle } from '../../../styles/Styles'
const EditEvent = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { eventDetails, isUpdated, isDeleted, loading, error } = useSelector(state => state.events);
    const { userDetails } = useSelector(state => state.users);
    const { id } = route.params;
    const [open, setOpen] = useState(false); // Whether the dropdown is open
    const [startDateOpen, setStartDateOpen] = useState(false); // Whether the date picker is open
    const [startDate, setStartDate] = useState(new Date());
    const [endDateOpen, setEndDateOpen] = useState(false); // Whether the date picker is open
    const [endDate, setEndDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [items, setItems] = useState([  // Options in the dropdown
        { label: 'Not-Due', value: "Not-Due" },
        { label: 'On-Going', value: "On-Going" },
        { label: 'Done', value: "Done" },

    ]);
    const handleStartConfirm = () => {

        setStartDateOpen(false);  // Close the picker after selection
    };
    const handleEndConfirm = () => {
        setEndDateOpen(false);  // Close the picker after selection
    }


    const handleMenuClick = () => {
        navigation.openDrawer();
    }
    const handleLogoutClick = () => {
        dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
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


    useEffect(() => {
        dispatch(getEventDetails(id))
        dispatch(getUserDetails());
    }, [dispatch, id])
    useEffect(() => {
        if (eventDetails && eventDetails.eventDetails) {
            const start = new Date(eventDetails.eventDetails.start)
            const end = new Date(eventDetails.eventDetails.end)

            setTitle(eventDetails.title);
            setDescription(eventDetails.description);
            setStatus(eventDetails.eventStatus);

            setStart(new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
            setEnd(new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
        }
    }, [eventDetails])

    useEffect(() => {
        if (isUpdated) {
            dispatch(resetUpdate());
            navigation.navigate('superadmin_schedules');
        }
        if (isDeleted) {
            dispatch(resetDelete());
            navigation.navigate('superadmin_schedules');
        }
    }, [dispatch, isUpdated, isDeleted, navigation])
    const showEditDeleteOptions = () => {
        Alert.alert(
            "Delete Event",
            `Are you sure you want to delete this event?`,
            [
                
                { text: "Delete", onPress: () => handleDelete() },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };
    const handleDelete = () => {
        dispatch(deleteEvents(id));
    }
    return (
        <>
            <Header onLogoutPress={handleLogoutClick} onMenuPress={handleMenuClick} />
            <View style={styles.container}>
                <Text style={SuperAdmin.headerText}>Edit Event</Text>
                <View style={{ padding: 8 }}>
                    <Formik
                        initialValues={{
                            title: title || '',
                            description: description || '',
                            status: status || '',
                            start: start || '',
                            end: end || ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            const localStart = new Date(values.start);
                            const localEnd = new Date(values.end);
                            const formData = {
                                title: values.title,
                                description: values.description,
                                status: values.status,
                                start: localStart,
                                end: localEnd,
                                user: userDetails._id,
                                id: id
                            }

                            dispatch(editEvents(formData))
                        }}
                        enableReinitialize
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

                                    {errors.start && touched.start && <Text style={styles.errorText}>{errors.start}</Text>}
                                </View>

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

                                    {errors.end && touched.end && <Text style={styles.errorText}>{errors.end}</Text>}
                                </View>


                                <TouchableOpacity style={{ ...buttonStyle.defaultBtn, width: "100%", backgroundColor: "green" }} onPress={handleSubmit}>
                                    <Text style={buttonStyle.btnText}>Update Event</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...buttonStyle.defaultBtn, width: "100%", backgroundColor: "red" }} onPress={showEditDeleteOptions}>
                                    <Text style={buttonStyle.btnText}>Delete Event</Text>
                                </TouchableOpacity>
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

        color: 'red'
    }
})

export default EditEvent