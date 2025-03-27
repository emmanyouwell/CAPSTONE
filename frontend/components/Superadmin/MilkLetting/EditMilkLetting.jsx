import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLetting } from '../../../redux/actions/lettingActions';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import Header from '../Header';
import { logoutUser } from '../../../redux/actions/userActions';
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { SuperAdmin, buttonStyle } from '../../../styles/Styles';
import { resetSuccess } from '../../../redux/slices/lettingSlice';

const EditMilkLetting = ({ route, navigation }) => {
    const item = route.params?.item;

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(item?.status || '');
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const dispatch = useDispatch();
    const { success } = useSelector(state => state.lettings);

    useEffect(() => {
        if (success) {
            dispatch(resetSuccess());
            navigation.navigate('superadmin_milkLetting');
        }
    }, [dispatch, success]);

    const validationSchema = Yup.object({
        activity: Yup.string().required("Activity is required"),
        venue: Yup.string().required("Venue is required"),
        start: Yup.date().required("Start date is required"),
        end: Yup.date().required("End date is required").min(Yup.ref("start"), "End date must be after start date"),
    });

    return (
        <>
            <Header onLogoutPress={() => dispatch(logoutUser())} onMenuPress={() => navigation.openDrawer()} />
            <View style={styles.container}>
                <Text style={SuperAdmin.headerText}>Edit Milk Letting Event</Text>
                <Formik
                    initialValues={{
                        activity: item?.activity || '',
                        venue: item?.venue || '',
                        start: item?.actDetails?.start || '',
                        end: item?.actDetails?.end || '',
                        description: item?.description
                    }}
                    validationSchema={validationSchema}
                    onSubmit={values => {
                        const formData = {
                            id: item._id,
                            activity: values.activity,
                            venue: values.venue,
                            start: values.start,
                            end: values.end,
                            status: status,
                            description: values.description,
                            admin: item.admin,
                        };
                        console.log("data: ", formData)
                        dispatch(updateLetting(formData));
                        if (status === 'Done') {
                            navigation.navigate('HistoryLetting')
                        } else {
                            navigation.navigate('superadmin_milkLetting')
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                        <View>
                            <Text>Event name</Text>
                            <TextInput
                                placeholder="Enter name of the activity"
                                onChangeText={handleChange('activity')}
                                onBlur={handleBlur('activity')}
                                value={values.activity}
                                style={styles.textInputStyle}
                            />
                            {errors.activity && touched.activity && <Text style={styles.errorText}>{errors.activity}</Text>}
                            <Text>Venue</Text>
                            <TextInput
                                placeholder="Enter the name of the venue"
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
                            <Text>Status</Text>
                            <DropDownPicker
                                open={open}
                                value={status}
                                items={[{ label: 'Not-Due', value: 'Not-Due' }, { label: 'On-Going', value: 'On-Going' }, { label: 'Done', value: 'Done' }]}
                                setOpen={setOpen}
                                setValue={setStatus}
                                placeholder="Select Status"
                                style={styles.dropdown}
                            />

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
                                <Text>{values.start ? moment(values.start).format('MMMM Do YYYY, h:mm:ss a') : "Select Start Date"}</Text>
                            </TouchableOpacity>
                            {startDateOpen && (
                                <DatePicker
                                    modal
                                    open={startDateOpen}
                                    date={new Date(values.start)}
                                    onConfirm={(selectedDate) => {
                                        setFieldValue('start', new Date(selectedDate).toISOString());
                                        setStartDateOpen(false);
                                    }}
                                    onCancel={() => setStartDateOpen(false)}
                                    mode="datetime"
                                />
                            )}

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
                                    marginVertical: 8,
                                }}
                            >
                                <Text >{values.end ? moment(values.end).format('MMMM Do YYYY, h:mm:ss a') : "Select End Date"}</Text>
                            </TouchableOpacity>
                            {endDateOpen && (
                                <DatePicker
                                    modal
                                    open={endDateOpen}
                                    date={new Date(values.end)}
                                    onConfirm={(selectedDate) => {
                                        setFieldValue('end', new Date(selectedDate).toISOString());
                                        setEndDateOpen(false);
                                    }}
                                    onCancel={() => setEndDateOpen(false)}
                                    mode="datetime"
                                />
                            )}

                            <Button title="Submit" onPress={handleSubmit} />
                        </View>
                    )}
                </Formik>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10, flex: 1 },
    textInputStyle: { padding: 8, marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
    textAreaStyle: { height: 100, marginVertical: 8, padding: 8, borderColor: '#ccc', borderRadius: 4, borderWidth: 1, textAlignVertical: 'top' },
    dropdown: { marginVertical: 8, backgroundColor: '#fafafa', borderColor: '#ccc', borderWidth: 1, borderRadius: 4 },
    selectedDate: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 4, borderColor: '#ccc' },
    errorText: { marginVertical: 4, color: 'red' }
});

export default EditMilkLetting;
