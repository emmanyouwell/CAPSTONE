import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Header from "../Header";
import { SuperAdmin } from "../../../styles/Styles";
import { approveSchedule } from "../../../redux/actions/scheduleActions";

const EditSchedule = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);

  const { item } = route.params;
  const [venue, setVenue] = useState(item.address);
  const [date, setDate] = useState(new Date(item.dates));
  const [open, setOpen] = useState(false);

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.navigate("login");
      })
      .catch((err) => console.log(err));
  };

  const handleSave = () => {
    const updatedData = {
      scheduleId: item._id,
      venue: venue,
      newDate: date,
      adminId: userDetails._id,
    };

    dispatch(approveSchedule(updatedData))
      .then(() => {
        Alert.alert("Success", "Schedule updated.");
        navigation.goBack();
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const handlePress = () => {
      Alert.alert(
        "Confirm Edit and Approve",
        "Are you sure you want to update and approve this Schedule?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Approve",
            style: "destructive",
            onPress: () => handleSave(),
          },
        ]
      );
    };

  return (
    <View contentContainerStyle={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <Text style={styles.screenTitle}>Edit Schedule</Text>
      <ScrollView style={styles.section}>
        <Text style={styles.label}>Venue</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="Enter venue"
        />

        <Text style={styles.label}>Schedule Date</Text>
        <TouchableOpacity onPress={() => setOpen(true)} style={styles.input}>
          <Text>{moment(date).format("MMMM Do YYYY, h:mm A")}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={open}
          date={date}
          mode="datetime"
          onConfirm={(selectedDate) => {
            setOpen(false);
            setDate(selectedDate);
          }}
          onCancel={() => setOpen(false)}
        />

        <Text style={styles.label}>Donor</Text>
        <Text style={styles.text}>
          {`${item.donorDetails.donorId.user.name.last}, ${item.donorDetails.donorId.user.name.first}`}
        </Text>

        <Text style={styles.label}>Volume</Text>
        <Text style={styles.text}>{item.totalVolume}</Text>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  section: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    color: "#555",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditSchedule;
