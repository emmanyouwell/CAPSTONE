import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../../../components/Superadmin/Header";
import { getDonors } from "../../../redux/actions/donorActions";
import {
  newPublicDonor,
  markAttendance,
} from "../../../redux/actions/lettingActions";
import { logoutUser } from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";
import DatePicker from "react-native-date-picker";

const Attendance = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastDonationOpen, setLastDonationOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [donorType, setDonorType] = useState("");
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
  const [bagDetails, setBagDetails] = useState(() => ({
    volume: "",
    quantity: "",
  }));
  const { donors } = useSelector((state) => state.donors);

  const [open, setOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorItems, setDonorItems] = useState([]);
  const [bags, setBags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getDonors({ search: "", page: 1, pageSize: 100 }));
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getDonors({ search: "", page: 1, pageSize: 100 }))
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    if (donors) {
      const items = donors.map((donor) => ({
        label: `${donor.user.name.first} ${donor.user.name.last} (${donor.home_address.street}, ${donor.home_address.brgy}, ${donor.home_address.city} | ${donor.user.phone} | ${donor.donorType})`,
        value: donor._id,
      }));
      setDonorItems(items);
    }
  }, [donors]);

  const addBags = () => {
    const { volume, quantity } = bagDetails;

    if (!volume || !quantity) {
      Alert.alert("Error", "Please fill out all fields for the donation.");
      return;
    }

    const newBags = {
      volume: Number(volume),
      quantity: Number(quantity),
    };

    setBags([...bags, newBags]);
    setBagDetails({
      ...bagDetails,
      volume: "",
      quantity: "",
    });
  };

  const handleEligibility = (eligible) => (eligible ? setStep(4) : setStep(1));

  const handleNewRecord = () => {
    setForm({
      donor_type: "Community",
    });
    setBags([]);
    setBagDetails({});
    setSelectedDonor(null);
    console.log(
      "State Data: \n",
      "Form: " + form,
      "\n",
      "Bags: " + bags,
      "\n",
      "Bag Details: " + bagDetails,
      "\n",
      "SelectedDonor: " + selectedDonor
    );
    setStep(1);
  };

  const handleSubmitNewDonor = () => {
    const data = {
      formData: form,
    };
    dispatch(newPublicDonor(data))
      .then(() => {
        Alert.alert("Success", "Data Saved");
        setStep(7);
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const handleSubmit = async () => {
    if (!donorType || !selectedDonor) {
      Alert.alert("Error", "Please choose a Donor.");
      return;
    }
    if (!bags) {
      Alert.alert("Error", "Need atleast 1 bag details");
      return;
    }
    if (!item) {
      Alert.alert("Error", "Milk Letting not found");
      return;
    }

    const newData = {
      lettingId: item._id,
      donorId: selectedDonor,
      donorType: donorType,
      lastDonation: selectedDate,
      bags: bags,
    };

    await dispatch(markAttendance(newData))
      .then((res) => {
        Alert.alert("Success", "Attendance recorded.");
        setStep(5);
      })
      .catch((error) => {
        console.error("Error adding inventory:", error);
        Alert.alert("Error", "Failed to add attendance.");
      });
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
          <Text style={styles.subTitle}>Birthday</Text>
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
        <View style={styles.section}>
          <Button title="Submit Donor" onPress={handleSubmitNewDonor} />
        </View>
      </>
    );
  };

  return (
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <Text style={styles.screenTitle}>Attendance</Text>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {step === 1 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>Are you a New or Old Donor?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setDonorType("New Donor");
                setStep(2);
              }}
            >
              <Text style={styles.buttonText}>New Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setDonorType("Old Donor");
                setStep(3);
              }}
            >
              <Text style={styles.buttonText}>Old Donor</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>Filled the form?</Text>
            <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setStep(6)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 7 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>Want to continue or new attendance?</Text>
            <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
              <Text style={styles.buttonText}>New Attendance</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 6 && renderFormFields()}

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
            {donorType === "Old Donor" && (
              <>
                <Text style={styles.subTitle}>Last Breast Milk Donation:</Text>
                <TouchableOpacity
                  onPress={() => setLastDonationOpen(true)}
                  style={{ ...styles.input, flex: 1, justifyContent: "center" }}
                >
                  <Text>
                    {selectedDate
                      ? selectedDate.toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select Express Date"}
                  </Text>
                </TouchableOpacity>

                {/* Modal Date Picker */}
                <DatePicker
                  modal
                  open={lastDonationOpen}
                  date={selectedDate ? selectedDate : new Date()}
                  mode="date"
                  onConfirm={(date) => {
                    setOpen(false);
                    setSelectedDate(date);
                  }}
                  onCancel={() => setLastDonationOpen(false)}
                />
              </>
            )}
            <Text style={styles.subTitle}>Bag Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume (ml)"
              keyboardType="numeric"
              onChangeText={(value) =>
                setBagDetails({ ...bagDetails, volume: Number(value) })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              onChangeText={(value) =>
                setBagDetails({ ...bagDetails, quantity: Number(value) })
              }
            />
            <Button title="Add Bag Details" onPress={addBags} />
            {bags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.bagsList}>
                  <Text style={styles.subTitle}>Bags:</Text>
                  {bags.map((bag, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text>Volume: {bag.volume} mL</Text>
                      <Text>Quantity: {bag.quantity}</Text>
                    </View>
                  ))}
                </View>
                <Button title="Submit" onPress={handleSubmit} />
              </View>
            )}
          </>
        )}

        {step === 5 && (
          <View style={styles.navButtons}>
            <Text style={styles.title}>
              Do you want to make another attendance?
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNewRecord()}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("FinalizeLetting", { item: item })
              }
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
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
  bagsList: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 18,
    // fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 16,
  },
});

export default Attendance;
