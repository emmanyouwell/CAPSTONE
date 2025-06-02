import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
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
  updateAttendance,
} from "../../../redux/actions/lettingActions";
import { SuperAdmin } from "../../../styles/Styles";
import DatePicker from "react-native-date-picker";
import { BARANGAY_OPTIONS, styles, requiredFields } from "./constants";

const Attendance = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastDonationOpen, setLastDonationOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [donorType, setDonorType] = useState("");
  const [showBirthday, setShowBirthday] = useState(false);
  const [showChildBirthday, setShowChildBirthday] = useState(false);
  const [form, setForm] = useState(() => ({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    street: "",
    brgy: "",
    city: "Taguig City",
    age: "",
    birthday: "",
    office_address: "",
    contact_number_2: "",
    donor_type: "Community",
    occupation: "",
    child_name: "",
    child_bday: "",
    birth_weight: "",
    aog: "",
  }));
  const [bagDetails, setBagDetails] = useState(() => ({
    volume: "",
    quantity: "",
  }));
  const { donors } = useSelector((state) => state.donors);
  const { loading } = useSelector((state) => state.lettings);

  const [open, setOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorItems, setDonorItems] = useState([]);
  const [bags, setBags] = useState([]);
  const [additionalBags, setAdditionalBags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [barangayOpen, setBarangayOpen] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);

  const [showAddDetails, setShowAddDetails] = useState(false);
  const [expressedDateOpen, setExpressedDateOpen] = useState(false);
  const [expressedDate, setExpressedDate] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(() => ({
    volume: "",
  }));

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

  const addExtraBags = () => {
    const { volume } = additionalDetails;

    if (!volume || !expressedDate) {
      Alert.alert("Error", "Error here");
      return;
    }

    const newBags = {
      volume: Number(volume),
      expressDate: expressedDate,
    };

    setAdditionalBags([...additionalBags, newBags]);
    setAdditionalDetails({
      ...additionalDetails,
      volume: "",
    });
    setExpressedDate(null)
  };

  const handleEligibility = (eligible) => (eligible ? setStep(4) : setStep(1));

  const handleNewRecord = () => {
    setForm({
      donor_type: "Community",
    });
    setBags([]);
    setBagDetails({});
    setAdditionalBags([]);
    setAdditionalDetails({});
    setSelectedDonor(null);
    setStep(1);
  };

  const removeBag = (indexToRemove) => {
    const updatedBags = bags.filter((_, index) => index !== indexToRemove);
    setBags(updatedBags);
  };

  const removeAddBag = (indexToRemove) => {
    const updatedBags = additionalBags.filter(
      (_, index) => index !== indexToRemove
    );
    setAdditionalBags(updatedBags);
  };

  const handleSubmitNewDonor = () => {
    // Check for any empty required fields
    const emptyFields = requiredFields.filter((field) => {
      return (
        form[field] === "" || form[field] === null || form[field] === undefined
      );
    });

    if (emptyFields.length > 0) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

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

    const additionalData = {
      id: item._id,
      donorId: selectedDonor,
      bags: additionalBags,
    };

    await dispatch(markAttendance(newData))
      .then(() => {
        if (additionalBags.length > 0) {
          dispatch(updateAttendance(additionalData)).then(() => {
            Alert.alert(
              "Success",
              "Attendance recorded and additional bags added."
            );
            setStep(5);
          });
        } else {
          Alert.alert("Success", "Attendance recorded.");
          setStep(5);
        }
      })
      .catch((error) => {
        console.error("Error adding inventory:", error);
        Alert.alert("Error", "Failed to add attendance.");
      });
  };

  const handleDateChange = (event, selectedDate, field) => {
    const date = selectedDate || form[field];
    setForm({ ...form, [field]: date.toISOString().split("T")[0] });
    if (field === "child_bday") setShowChildBirthday(false);
  };

  const handleDonorBirthday = (event, date, field) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setForm((prevForm) => ({
        ...prevForm,
        [field]: formattedDate,
        age: calculateAge(date),
      }));
      setShowBirthday(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const renderFormFields = () => {
    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor Details</Text>
          <Text style={styles.requiredLabel}>* First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            onChangeText={(value) => setForm({ ...form, first_name: value })}
          />
          <Text style={{ fontSize: 14 }}>Middle Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter middle name"
            onChangeText={(value) => setForm({ ...form, middle_name: value })}
          />
          <Text style={styles.requiredLabel}>* Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            onChangeText={(value) => setForm({ ...form, last_name: value })}
          />
          <Text style={styles.requiredLabel}>* Birthday</Text>
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
                handleDonorBirthday(event, date, "birthday")
              }
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.requiredLabel}>* Street</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street"
            onChangeText={(value) => setForm({ ...form, street: value })}
          />
          <Text style={styles.requiredLabel}>* Baranggay</Text>
          <View style={{ zIndex: 1000, marginBottom: barangayOpen ? 200 : 5 }}>
            <DropDownPicker
              open={barangayOpen}
              value={form.brgy}
              items={BARANGAY_OPTIONS}
              setOpen={setBarangayOpen}
              setValue={(val) => setForm({ ...form, brgy: val() })}
              setItems={() => {}}
              placeholder="Select Barangay"
              searchable={true}
              searchPlaceholder="Search barangay"
              style={styles.dropdown}
              dropDownContainerStyle={{ zIndex: 1000 }}
            />
          </View>

          {showCityInput && (
            <>
              <Text style={styles.requiredLabel}>* City</Text>
              <TextInput
                style={styles.input}
                value={form.city}
                placeholder="Enter city"
                onChangeText={(value) => setForm({ ...form, city: value })}
              />
            </>
          )}
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setShowCityInput(!showCityInput)}
            >
              <View style={styles.radioCircle}>
                {showCityInput && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Outside Taguig</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Details</Text>
          <Text style={styles.requiredLabel}>* Child Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter child name"
            onChangeText={(value) => setForm({ ...form, child_name: value })}
          />
          <Text style={styles.requiredLabel}>* Child Birthday</Text>
          <TouchableOpacity
            onPress={() => setShowChildBirthday(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {form.child_bday || "Select child birthday"}
            </Text>
          </TouchableOpacity>
          {showChildBirthday && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) =>
                handleDateChange(event, date, "child_bday")
              }
            />
          )}
          <Text style={styles.requiredLabel}>* Birth Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter birth weight (kg)"
            keyboardType="numeric"
            onChangeText={(value) =>
              setForm({ ...form, birth_weight: Number(value) })
            }
          />
          <Text style={styles.requiredLabel}>* Age of Gestation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age of gestation (weeks)"
            keyboardType="numeric"
            onChangeText={(value) => setForm({ ...form, aog: Number(value) })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Details </Text>
          <Text style={styles.requiredLabel}>* Phone Number</Text>
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
            placeholder="Email"
            onChangeText={(value) => setForm({ ...form, email: value })}
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
            placeholder="Office Contact Number"
            onChangeText={(value) =>
              setForm({ ...form, contact_number_2: value })
            }
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
      <Header />
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
            <Text style={styles.title}>
              Want to continue or new attendance?
            </Text>
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
                      : "Select last donation date"}
                  </Text>
                </TouchableOpacity>

                {/* Modal Date Picker */}
                <DatePicker
                  modal
                  open={lastDonationOpen}
                  date={selectedDate ? selectedDate : new Date()}
                  mode="date"
                  onConfirm={(date) => {
                    setLastDonationOpen(false);
                    setSelectedDate(date);
                  }}
                  onCancel={() => setLastDonationOpen(false)}
                />
              </>
            )}
            <Text style={styles.subTitle}>Bag Details:</Text>
            <Text style={styles.requiredLabel}>* Volume (ml)</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume (ml)"
              keyboardType="numeric"
              value={
                showAddDetails ? additionalDetails.volume : bagDetails.volume
              }
              onChangeText={(value) => {
                showAddDetails
                  ? setAdditionalDetails({
                      ...additionalDetails,
                      volume: value,
                    })
                  : setBagDetails({ ...bagDetails, volume: value });
              }}
            />
            {showAddDetails ? (
              <>
                <Text style={styles.requiredLabel}>* Expressed Date:</Text>
                <TouchableOpacity
                  onPress={() => setExpressedDateOpen(true)}
                  style={{ ...styles.input, flex: 1, justifyContent: "center" }}
                >
                  <Text>
                    {expressedDate
                      ? expressedDate.toLocaleString("en-US", {
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
                  open={expressedDateOpen}
                  date={expressedDate ? expressedDate : new Date()}
                  mode="date"
                  onConfirm={(date) => {
                    setExpressedDateOpen(false);
                    setExpressedDate(date);
                  }}
                  onCancel={() => setExpressedDateOpen(false)}
                />
              </>
            ) : (
              <>
                <Text style={styles.requiredLabel}>* Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={bagDetails.quantity}
                  onChangeText={(value) =>
                    setBagDetails({ ...bagDetails, quantity: value })
                  }
                />
              </>
            )}
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setShowAddDetails(!showAddDetails)}
                disabled={loading}
              >
                <View style={styles.radioCircle}>
                  {showAddDetails && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Additional Bags</Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Add Bag Details"
              disabled={loading}
              onPress={() => {
                showAddDetails ? addExtraBags() : addBags();
              }}
            />
            {bags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.bagsList}>
                  <Text style={styles.subTitle}>Bags:</Text>
                  {bags?.map((bag, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text>Volume: {bag.volume} mL</Text>
                      <Text>Quantity: {bag.quantity}</Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeBag(index)}
                      >
                        <Text style={styles.deleteText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <Text style={styles.subTitle}>Additional Bags:</Text>
                  {additionalBags?.map((bag, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text>Volume: {bag.volume} mL</Text>
                      <Text>
                        Expressed Date: {bag.expressDate.toLocaleDateString()}
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeAddBag(index)}
                        disabled={loading}
                      >
                        <Text style={styles.deleteText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Button
                  title={loading ? "Submitting..." : "Submit"}
                  onPress={handleSubmit}
                  disabled={loading}
                />
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

export default Attendance;
