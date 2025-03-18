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
                        end: item?.actDetails?.end || ''
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
                            admin: item.admin,
                        };
                        console.log("data: ", formData)
                        dispatch(updateLetting(formData));
                        navigation.navigate('superadmin_milkLetting')
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                        <View>
                            <TextInput
                                placeholder="Activity"
                                onChangeText={handleChange('activity')}
                                onBlur={handleBlur('activity')}
                                value={values.activity}
                                style={styles.textInputStyle}
                            />
                            {errors.activity && touched.activity && <Text style={styles.errorText}>{errors.activity}</Text>}

                            <TextInput
                                placeholder="Venue"
                                onChangeText={handleChange('venue')}
                                onBlur={handleBlur('venue')}
                                value={values.venue}
                                style={styles.textAreaStyle}
                                multiline
                            />

                            <DropDownPicker
                                open={open}
                                value={status}
                                items={[{ label: 'Not-Due', value: 'Not-Due' }, { label: 'On-Going', value: 'On-Going' }, { label: 'Done', value: 'Done' }]}
                                setOpen={setOpen}
                                setValue={setStatus}
                                placeholder="Select Status"
                                style={styles.dropdown}
                            />

                            <TouchableOpacity style={buttonStyle.defaultBtn} onPress={() => setStartDateOpen(true)}>
                                <Text style={{ color: 'white' }}>Start Date</Text>
                            </TouchableOpacity>
                            <Text style={styles.selectedDate}>{values.start ? moment(values.start).format('MMMM Do YYYY, h:mm:ss a') : "Select Start Date"}</Text>
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

                            <TouchableOpacity style={buttonStyle.defaultBtn} onPress={() => setEndDateOpen(true)}>
                                <Text style={{ color: 'white' }}>End Date</Text>
                            </TouchableOpacity>
                            <Text style={styles.selectedDate}>{values.end ? moment(values.end).format('MMMM Do YYYY, h:mm:ss a') : "Select End Date"}</Text>
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
    textAreaStyle: { height: 100, padding: 8, borderColor: '#ccc', borderRadius: 4, borderWidth: 1, textAlignVertical: 'top' },
    dropdown: { backgroundColor: '#fafafa', borderColor: '#ccc', borderWidth: 1, borderRadius: 4 },
    selectedDate: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 4, borderColor: '#ccc' },
    errorText: { marginVertical: 4, color: 'red' }
});

export default EditMilkLetting;
