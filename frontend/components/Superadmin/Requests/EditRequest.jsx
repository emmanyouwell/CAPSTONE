import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useDispatch } from "react-redux";
import Header from "../Header";
import { logoutUser } from "../../../redux/actions/userActions";
import { updateVolumeRequested } from "../../../redux/actions/requestActions";
import { SuperAdmin } from "../../../styles/Styles";
import { ScrollView } from "react-native-gesture-handler";

const EditRequest = ({ navigation, route }) => {
  const request = route.params ? route.params.request : null;

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    volume: request?.volumeRequested?.volume?.toString() || "",
    days: request?.volumeRequested?.days?.toString() || "",
  });

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => navigation.navigate("login"))
      .catch((err) => console.log(err));
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    const { volume, days } = formData;

    if (!volume || !days) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const updatedRequest = {
      id: request._id,
      volume: Number(volume),
      days: Number(days),
    };

    dispatch(updateVolumeRequested(updatedRequest)).then((res) => {
      Alert.alert("Success", "Request Confirmed Successfully");
      navigation.navigate("RefRequest", {
        request: res.payload.request,
      });
    });
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <KeyboardAvoidingView
      style={SuperAdmin.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <Text style={styles.screenTitle}>Confirm Request Amount</Text>
      <ScrollView>
        {request ? (
          <>
            <View style={styles.section}>
              <Text style={styles.requestTitleText}>
                Request to be completed...
              </Text>
              <Text style={styles.requestText}>
                Requested Date: {formatDate(request.date)}
              </Text>
              <Text style={styles.requestText}>
                Patient Name: {request.patient.name}
              </Text>
              <Text style={styles.requestText}>
                Patient Type: {request.patient.patientType}
              </Text>
              <Text style={styles.requestText}>Reason: {request.reason}</Text>
              <Text style={styles.requestText}>
                Diagnosis: {request.diagnosis}
              </Text>
              <Text style={styles.requestText}>
                Staff Requested: {request.requestedBy?.name.last}, {request.requestedBy?.name.first}
              </Text>
              <Text style={styles.requestText}>
                Requested Volume: {request.volumeRequested.volume} ml
              </Text>
              <Text style={styles.requestText}>
                Requested Days: {request.volumeRequested.days} days
              </Text>
            </View>
          </>
        ) : (
          <></>
        )}
        <SafeAreaView style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requested Milk (mL/day)</Text>
            <Text style={styles.requestText}>Volume:</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume"
              keyboardType="numeric"
              value={formData.volume}
              onChangeText={(text) => handleChange("volume", text)}
            />
            <Text style={styles.requestText}>Days:</Text>
            <TextInput
              style={styles.input}
              placeholder="Days"
              keyboardType="numeric"
              value={formData.days}
              onChangeText={(text) => handleChange("days", text)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Confirm Request</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  requestText: {
    textAlign: "left",
    color: "#999",
    marginVertical: 8,
    fontSize: 16,
  },
  requestTitleText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 8,
    fontWeight: "bold",
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default EditRequest;
