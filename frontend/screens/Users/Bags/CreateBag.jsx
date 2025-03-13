import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-native-date-picker";
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Superadmin/Header'
import { colors } from '../../../styles/Styles'
import { createBag } from '../../../redux/actions/bagActions'
import { getUserDetails } from "../../../redux/actions/userActions";

const CreateBag = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const dispatch = useDispatch();
    const { bags } = useSelector((state) => state.bags);
    const { userDetails } = useSelector((state) => state.users);
    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onLogoutPress = () => {
        dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
    }
    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        volume: Yup.number()
            .typeError("Volume must be a number")
            .positive("Volume must be greater than 0")
            .required("Volume is required"),
        expressDate: Yup.date()
            .required("Express date is required")
    });
    useEffect(() => {
        dispatch(getUserDetails())
    }, [dispatch])
    return (
        <>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <View style={styles.container}>
                <Formik
                    initialValues={{ volume: "", expressDate: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        const data = {
                            volume: values.volume,
                            expressDate: values.expressDate,
                            donor: userDetails._id
                        }
                        dispatch(createBag(data)).then(() => { navigation.navigate('userHome') });

                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={{ padding: 20 }}>
                            {/* Volume Input */}
                            <Text>Volume (ml):</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    padding: 10,
                                    borderRadius: 5,
                                    marginBottom: 10
                                }}
                                keyboardType="numeric"
                                onChangeText={handleChange("volume")}
                                onBlur={handleBlur("volume")}
                                value={values.volume}
                            />
                            {touched.volume && errors.volume && (
                                <Text style={{ color: "red" }}>{errors.volume}</Text>
                            )}

                            {/* Express Date Picker */}
                            <Text>Express Date:</Text>
                            <TouchableOpacity
                                onPress={() => setOpen(true)}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    padding: 10,
                                    borderRadius: 5,
                                    marginBottom: 10,
                                    backgroundColor: "#f0f0f0"
                                }}
                            >
                                <Text>
                                    {selectedDate ? selectedDate.toLocaleString() : "Select Express Date"}
                                </Text>
                            </TouchableOpacity>

                            {/* Modal Date Picker */}
                            <DatePicker
                                modal
                                open={open}
                                date={selectedDate || new Date()}
                                mode="datetime"
                                onConfirm={(date) => {
                                    setOpen(false);
                                    setSelectedDate(date);
                                    setFieldValue("expressDate", date);
                                }}
                                onCancel={() => setOpen(false)}
                            />
                            {touched.expressDate && errors.expressDate && (
                                <Text style={{ color: "red" }}>{errors.expressDate}</Text>
                            )}

                            {/* Submit Button */}
                            <TouchableOpacity onPress={handleSubmit} style={{
                                backgroundColor: "#007bff",
                                padding: 12,
                                borderRadius: 5,
                                alignItems: "center"
                            }}>
                                <Text style={{ color: "#fff", fontSize: 16 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.color1,
        padding: 4,
    },
    container: {
        flex: 1,
        padding: 8,
        gap: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    defaultText: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
    }
})
export default CreateBag