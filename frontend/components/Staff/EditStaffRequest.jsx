import React, { useState, useEffect, startTransition } from "react";
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
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../../components/Superadmin/Header";
import { logoutUser } from "../../redux/actions/userActions";
import { getRecipients } from "../../redux/actions/recipientActions";
import { updateRequest } from "../../redux/actions/requestActions";
import { SuperAdmin } from "../../styles/Styles";
import moment from "moment";

const EditStaffRequest = ({ navigation, route }) => {
  const { request } = route.params;
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const [images, setImages] = useState(request.images || []);
  const [formData, setFormData] = useState({
    patient: request?.patient?._id || null,
    location:
      request.patient.patientType === "Outpatient"
        ? request.hospital
        : request.department,
    diagnosis: request?.diagnosis || "",
    reason: request?.reason || "",
    doctor: request?.doctor || "",
    volume: request?.volumeRequested?.volume?.toString() || "",
    days: request?.volumeRequested?.days?.toString() || "",
  });
  const [open, setOpen] = useState(false);
  const [patientItems, setPatientItems] = useState([]);
  const [outPatient, setOutPatient] = useState(false);

  useEffect(() => {
    dispatch(getRecipients({ search: "", page: 1, pageSize: 100 }))
      .then((response) => {
        const patientList = response.payload?.patients?.map((patient) => ({
          label: `${patient.name} (${patient.home_address.street}, ${patient.home_address.brgy}, ${patient.home_address.city} | ${patient.phone})`,
          value: patient._id,
        }));
        setPatientItems(patientList || []);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  }, [dispatch]);

  useEffect(() => {
    setOutPatient(request.patient.patientType === "Outpatient");

    setFormData((prev) => ({
      ...prev,
      patient: request?.patient?._id || null,
      location:
        request.patient.patientType === "Outpatient"
          ? request.hospital
          : request.department,
      diagnosis: request?.diagnosis || "",
      reason: request?.reason || "",
      doctor: request?.doctor || "",
      volume: request?.volumeRequested?.volume?.toString() || "",
      days: request?.volumeRequested?.days?.toString() || "",
    }));
  }, [request]);

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => navigation.replace("login"))
      .catch((err) => console.log(err));
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera roll permissions."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Ensure Base64 is included
    });

    if (!result.canceled) {
      setImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => ({
          url: `data:image/jpeg;base64,${asset.base64}`, // Proper Base64 format
          local: true,
        })),
      ]);
    }
  };

  const handleSubmit = () => {
    const { patient, location, diagnosis, reason, doctor, volume, days } =
      formData;
    const patientType = outPatient ? "Outpatient" : "Inpatient";
    if (
      !patient ||
      !location ||
      !diagnosis ||
      !reason ||
      !doctor ||
      !volume ||
      !days
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const requestedBy = request ? request.requestedBy._id : userDetails?._id;

    const requestData = {
      id: request._id,
      date: moment().format("YYYY-MM-DD"),
      patient,
      patientType,
      location,
      diagnosis,
      reason,
      doctor,
      requestedBy,
      type: patientType,
      volumeRequested: { volume: Number(volume), days: Number(days) },
      images,
    };

    dispatch(updateRequest(requestData))
      .then((res) => {
        Alert.alert("Success", "Request Updated");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error adding request:", error);
        Alert.alert("Error", "Failed to add request.");
      });
  };

  return (
    <KeyboardAvoidingView
      style={SuperAdmin.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <Text style={styles.screenTitle}>Request Information</Text>
      <ScrollView>
        <SafeAreaView style={styles.form} keyboardShouldPersistTaps="handled">
          <View style={[styles.section, { zIndex: 100 }]}>
            <Text style={styles.sectionTitle}>Patient</Text>
            <DropDownPicker
              open={open}
              value={formData.patient}
              items={patientItems}
              setOpen={setOpen}
              setValue={(callback) => {
                const newValue = callback(formData.patient);
                handleChange("patient", newValue);
              }}
              setItems={setPatientItems}
              placeholder="Select Patient"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              searchable={true}
              searchPlaceholder="Search for a patient..."
            />
          </View>
          <View style={styles.section}>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setOutPatient(!outPatient)}
              >
                <View style={styles.radioCircle}>
                  {outPatient && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Outpatient</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            {!outPatient ? (
              <View>
                <Text style={styles.sectionTitle}>Department</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Department"
                  value={formData.location}
                  onChangeText={(text) => handleChange("location", text)}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.sectionTitle}>Hospital</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hospital"
                  value={formData.location}
                  onChangeText={(text) => handleChange("location", text)}
                />
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnosis</Text>
            <TextInput
              style={styles.input}
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChangeText={(text) => handleChange("diagnosis", text)}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Reason"
              value={formData.reason}
              onChangeText={(text) => handleChange("reason", text)}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor</Text>
            <TextInput
              style={styles.input}
              placeholder="Doctor"
              value={formData.doctor}
              onChangeText={(text) => handleChange("doctor", text)}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requested Milk (mL/day)</Text>
            <TextInput
              style={styles.input}
              placeholder="volume (ml)"
              keyboardType="numeric"
              value={formData.volume}
              onChangeText={(text) => handleChange("volume", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="days"
              keyboardType="numeric"
              value={formData.days}
              onChangeText={(text) => handleChange("days", text)}
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePickImage}
            >
              <Text style={styles.imageButtonText}>Upload Images</Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.url }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={styles.removeImageText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
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
    zIndex: 1,
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
    zIndex: 100,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 200,
  },
  submitButton: {
    backgroundColor: "#007AFF",
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
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 4,
  },
  imageWrapper: {
    position: "relative",
    margin: 4,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgb(255, 255, 255)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 15,
  },
});

export default EditStaffRequest;
