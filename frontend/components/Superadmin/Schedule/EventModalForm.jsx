import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from '../../../redux/actions/userActions';
import { addEvents } from "../../../redux/actions/eventActions";
const EventModalForm = ({ modalVisible, setModalVisible, eventDetails }) => {
    //   const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const { userDetails, loading, error } = useSelector((state) => state.users);
    // Validation schema for Formik using Yup
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        eventDetails: Yup.date().required("Event date is required"),
        eventStatus: Yup.string()
            .oneOf(["Not-Due", "On-Going", "Done"], "Invalid status")
            .required("Event status is required"),
        userId: Yup.string()
            .matches(
                /^[0-9a-fA-F]{24}$/, // Regular expression to validate MongoDB ObjectId format
                "Invalid user ID"
            )
            .required("User ID is required")
    });
    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch])


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Formik
                                initialValues={{
                                    title: "",
                                    description: "",
                                    eventDetails: eventDetails ? eventDetails : new Date(),
                                    eventStatus: "Not-Due",
                                    userId: userDetails ? userDetails._id : "" ,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    const formData = {
                                        title: values.title,
                                        description: values.description,
                                        eventDetails: values.eventDetails,
                                        eventStatus: values.eventStatus,
                                        user: userDetails._id,
                                    }
                                    dispatch(addEvents(formData));
                                    setModalVisible(false); // Close modal on submit
                                }}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                }) => (
                                    <View>
                                        <Text style={styles.label}>Title</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange("title")}
                                            onBlur={handleBlur("title")}
                                            value={values.title}
                                            placeholder="Enter title"
                                        />
                                        {errors.title && touched.title && (
                                            <Text style={styles.errorText}>{errors.title}</Text>
                                        )}

                                        <Text style={styles.label}>Description</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange("description")}
                                            onBlur={handleBlur("description")}
                                            value={values.description}
                                            placeholder="Enter description"
                                            multiline
                                        />
                                        {errors.description && touched.description && (
                                            <Text style={styles.errorText}>{errors.description}</Text>
                                        )}

                                        <Text style={styles.label}>Event Date</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange("eventDetails")}
                                            onBlur={handleBlur("eventDetails")}
                                            value={eventDetails ? format(new Date(eventDetails), 'MM/dd/yyyy @ HH:mm') : "MM/dd/yyyy @ HH:mm"}
                                            placeholder="YYYY-MM-DD"
                                        />
                                        {errors.eventDetails && touched.eventDetails && (
                                            <Text style={styles.errorText}>{errors.eventDetails}</Text>
                                        )}

                                        <Text style={styles.label}>Event Status</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange("eventStatus")}
                                            onBlur={handleBlur("eventStatus")}
                                            value={values.eventStatus}
                                            placeholder="Not-Due, On-Going, Done"
                                        />
                                        {errors.eventStatus && touched.eventStatus && (
                                            <Text style={styles.errorText}>{errors.eventStatus}</Text>
                                        )}

                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                        >
                                            <Text style={styles.buttonText}>Submit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>

                                )}
                            </Formik>

                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        alignSelf: "flex-start",
        marginBottom: 5,
        fontSize: 16,
        color: "#333",
    },
    input: {
        width: 300,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorText: {
        alignSelf: "flex-start",
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#FF6347",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default EventModalForm;
