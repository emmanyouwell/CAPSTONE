import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../../../components/Superadmin/Header";
import { getDonors } from "../../../redux/actions/donorActions";
import { newPublicDonor } from "../../../redux/actions/lettingActions";
import { logoutUser } from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";

const Attendance = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;

  const [step, setStep] = useState(1);
  const [donorType, setDonorType] = useState("");
  const [donorName, setDonorName] = useState("");
  const [volumeDonated, setVolumeDonated] = useState("");
  const [showBirthday, setShowBirthday] = useState(false);
  const [form, setForm] = useState(() => ({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    street: "",
    brgy: "",
    city: "",
    age: "",
    birthday: "",
    office_address: "",
    contact_number_2: "",
    donor_type: "Community",
    occupation: "",
    child_name: "",
    child_age: "",
    birth_weight: "",
    aog: "",
  }));
  const { donors } = useSelector((state) => state.donors);

  const [open, setOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorItems, setDonorItems] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    dispatch(getDonors({ search: "", page: 1, pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (donors) {
      const items = donors.map((donor) => ({
        label: `${donor.user.name.first} ${donor.user.name.last} (${donor.home_address.street}, ${donor.home_address.brgy}, ${donor.home_address.city} | ${donor.user.phone} | ${donor.donorType})`,
        value: donor._id,
      }));
      setDonorItems(items);
    }
  }, [donors]);

  const handleNewDonor = () => setStep(2);

  const handlePastDonor = () => setStep(3);
  const handleEligibility = (eligible) => (eligible ? setStep(4) : setStep(1));

  const handleSubmitNewDonor = () => {
    const data = {
      formData: form,
    };
    dispatch(newPublicDonor(data))
      .then(() => {
        Alert.alert("Success", "Data Saved");
        setStep(3);
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const handleSubmit = () => {
    console.log({ donorName, donorType, volumeDonated });
    setDonorName("");
    setVolumeDonated("");
    setStep(1);
  };

  const handleDateChange = (event, selectedDate, field) => {
    const date = selectedDate || form[field];
    setForm({ ...form, [field]: date.toISOString().split("T")[0] });

    if (field === "birthday") setShowBirthday(false);
  };


  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.replace("login");
      })
      .catch((err) => console.log(err));
  };

  const renderFormFields = () => {
    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor Details</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(value) => setForm({ ...form, first_name: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Midldle Name"
            onChangeText={(value) => setForm({ ...form, middle_name: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(value) => setForm({ ...form, last_name: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            onChangeText={(value) => setForm({ ...form, age: Number(value) })}
          />
          {/* <Text style={styles.sectionTitle}>Birthday</Text> */}
          <TouchableOpacity
            onPress={() => setShowBirthday(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {form.birthday || "Select Birth Date"}
            </Text>
          </TouchableOpacity>
          {showBirthday && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) =>
                handleDateChange(event, date, "birthday")
              }
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Street"
            onChangeText={(value) => setForm({ ...form, street: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Baranggay"
            onChangeText={(value) => setForm({ ...form, brgy: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            onChangeText={(value) => setForm({ ...form, city: value })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="numeric"
            onChangeText={(value) =>
              setForm({ ...form, contact_number: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Occupation"
            onChangeText={(value) => setForm({ ...form, occupation: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Office Address"
            onChangeText={(value) =>
              setForm({ ...form, office_address: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            onChangeText={(value) =>
              setForm({ ...form, contact_number_2: value })
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Child Name"
            onChangeText={(value) => setForm({ ...form, child_name: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Child Age"
            keyboardType="numeric"
            onChangeText={(value) =>
              setForm({ ...form, child_age: Number(value) })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Birth Weight"
            keyboardType="numeric"
            onChangeText={(value) =>
              setForm({ ...form, birth_weight: Number(value) })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Age of Gestation"
            keyboardType="numeric"
            onChangeText={(value) => setForm({ ...form, aog: Number(value) })}
          />
        </View>
      </>
    );
  };

  return (
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <Text style={styles.screenTitle}>Attendance</Text>

      <ScrollView style={styles.container}>
        {step === 1 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>Are you a New or Past Donor?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setDonorType("New Donor");
                handleNewDonor();
              }}
            >
              <Text style={styles.buttonText}>New Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setDonorType("Past Donor");
                handlePastDonor();
              }}
            >
              <Text style={styles.buttonText}>Past Donor</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && renderFormFields()}

        {step === 3 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>Eligible to donate?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEligibility(true)}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEligibility(false)}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Donation Details</Text>
            <DropDownPicker
              open={open}
              value={selectedDonor}
              items={donorItems}
              setOpen={setOpen}
              setValue={setSelectedDonor}
              setItems={setDonorItems}
              placeholder="Select Donor"
              style={styles.dropdown}
              listItemContainerStyle={{ height: 60, borderBottomWidth: 1 }}
              searchable={true}
              searchPlaceholder="Search for a donor..."
            />
            {/* <Button title="Add Breast Milk" onPress={addDonation} />
            {donations.length > 0 && (
              <View style={styles.section}>
                <View style={styles.donationsList}>
                  <Text style={styles.subTitle}>Donations:</Text>
                  {donations.map((donation, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text>Volume: {donation.volume} mL</Text>
                      <Text>Quantity: {donation.quantity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )} */}
            <TextInput
              style={styles.input}
              placeholder="Volume Donated (ml)"
              keyboardType="numeric"
              value={volumeDonated}
              onChangeText={setVolumeDonated}
            />
            <Button title="Submit" onPress={handleSubmit} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButtons: {
    flex: 1,
    justifyContent: "center", // Center buttons vertically
    alignItems: "center", // Align buttons horizontally
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#E53777",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 16,
  },
  datePickerText: {
    color: "#000",
  },
  itemContainer: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  donationsList: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 16,
},
});

export default Attendance;
