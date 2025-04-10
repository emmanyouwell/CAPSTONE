import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../../../../components/Superadmin/Header";
import { logoutUser } from "../../../../redux/actions/userActions";
import { SuperAdmin } from "../../../../styles/Styles";
import { getFridges } from "../../../../redux/actions/fridgeActions";
import { addInventory } from "../../../../redux/actions/inventoryActions";

const AddMilkInventory = ({ route, navigation }) => {
  const fridge = route.params.selectedBags
    ? { fridgeType: "Pasteurized" }
    : route.params;

  const items = route.params.selectedBags ? route.params.selectedBags : []; 
  const totalVolume = items.reduce((total, item) => {
    return total + (Number(item.volume) || 0);
  }, 0);

  const dispatch = useDispatch();
  const [bottleType, setBottleType] = useState(null);
  const [formData, setFormData] = useState(() => ({}));

  const { fridges, loading, error } = useSelector((state) => state.fridges);
  const { userDetails } = useSelector((state) => state.users);

  const [open, setOpen] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState(null);
  const [fridgeItems, setFridgeItems] = useState([]);

  const [donors, setDonors] = useState([]);
  const [showPasteurizationDatePicker, setShowPasteurizationDatePicker] = useState(false);

  useEffect(() => {
    dispatch(getFridges());
  }, [dispatch]);

  useEffect(() => {
    if (fridges) {
      const filteredFridges = fridges.filter(
        (fridge) => fridge.fridgeType === "Pasteurized"
      );
      const item = filteredFridges.map((fridge) => ({
        label: `${fridge.name}`,
        value: fridge._id,
      }));
      setFridgeItems(item);
    }
    if (items) {
      const donated = [];
      items.forEach((donate) => {
        if (!donated.includes(donate.donor._id)) {
          donated.push(donate.donor._id);
        }
      });
      setDonors(donated);
    }
  }, [fridges, items]);

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const handleDateChange = (event, selectedDate, field) => {
    const date = selectedDate || formData[field];
    setFormData({ ...formData, [field]: date.toISOString().split("T")[0] });
    if (field === "pasteurizationDate") setShowPasteurizationDatePicker(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.replace("login");
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async () => {
    if (!formData || !selectedFridge || !items || !bottleType) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (!userDetails || !userDetails._id) {
      Alert.alert("Error", "Failed to retrieve user details.");
      return;
    }

    if (!donors) {
      Alert.alert("Error", "There are no donors");
      return;
    }

    const fid = selectedFridge ? selectedFridge : fridge._id;

    const newData = {
      fridgeId: fid,
      userId: userDetails._id,
    };

    if (fridge.fridgeType === "Pasteurized") {
      const { pasteurizationDate, batch, pool, bottleQty } = formData;

      if (!pasteurizationDate || !batch || !pool || !bottleQty) {
        Alert.alert(
          "Error",
          "Please fill out all fields for pasteurized milk."
        );
        return;
      }

      if (bottleQty > 20) {
        Alert.alert("Error", "Maximum of 20 bottle quantity");
        return;
      }

      newData.pasteurizedDetails = {
        pasteurizationDate,
        batch,
        pool,
        bottleQty,
        bottleType,
        donors: donors,
        items: items,
      };
      console.log(newData);
      try {
        dispatch(addInventory(newData));
        Alert.alert("Success", "Inventory has been added successfully.");

        navigation.goBack();
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to add Inventory or update item status. Please try again."
        );
        console.error(error);
      }
    } else {
      console.log("Wrong fridge type");
      Alert.alert("Error", "Unknown fridge type. Please contact support.");
    }
  };

  const renderFormFields = () => {
    if (fridge.fridgeType === "Pasteurized") {
      return (
        <>
          <DropDownPicker
            open={open}
            value={selectedFridge}
            items={fridgeItems}
            setOpen={setOpen}
            setValue={setSelectedFridge}
            setItems={setFridgeItems}
            placeholder="Select Fridge"
            style={styles.dropdown}
          />
          <TouchableOpacity
            onPress={() => setShowPasteurizationDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {formData.pasteurizationDate || "Select Pasteurization Date"}
            </Text>
          </TouchableOpacity>
          {showPasteurizationDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) =>
                handleDateChange(event, date, "pasteurizationDate")
              }
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Batch"
            keyboardType="numeric"
            onChangeText={(value) =>
              setFormData({ ...formData, batch: Number(value) })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Pool"
            keyboardType="numeric"
            onChangeText={(value) =>
              setFormData({ ...formData, pool: Number(value) })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="bottleQty"
            keyboardType="numeric"
            onChangeText={(value) =>
              setFormData({ ...formData, bottleQty: Number(value) })
            }
          />
          <Text style={styles.radioLabel}>Bottle Type</Text>
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={(value) => setBottleType(Number(value))}
              value={bottleType}
            >
              <View style={styles.radioOption}>
                <RadioButton value={100} />
                <Text>100 ml</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value={200} />
                <Text>200 ml</Text>
              </View>
            </RadioButton.Group>
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.title}>Add Pastuerized Milk</Text>
          {renderFormFields()}
        </View>
        {items && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Donors:</Text>
            {[
              ...new Map(
                items.map((donor) => [donor.donor._id, donor])
              ).values(),
            ].map((donor) => (
              <View key={donor.donor._id} style={styles.donorCard}>
                <Text style={styles.donorName}>
                  {donor.donor.user.name.first} {donor.donor.user.name.middle}{" "}
                  {donor.donor.user.name.last}
                </Text>
                <Text>
                  Address: {donor.donor.home_address.street},{" "}
                  {donor.donor.home_address.brgy},{" "}
                  {donor.donor.home_address.city}
                </Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>
              Volume to Pasteur:{"\t"}{totalVolume} mL
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Button title="Submit Inventory" onPress={handleSubmit} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dropdown: {
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
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
  donationsList: {
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
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
  donorCard: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default AddMilkInventory;
