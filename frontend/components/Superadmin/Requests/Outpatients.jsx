import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../Header";
import { logoutUser } from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";
import {
  getRequests,
  outpatientDispense,
} from "../../../redux/actions/requestActions";
import { resetMessage } from "../../../redux/slices/requestSlice";

const Outpatients = ({ navigation }) => {
  const dispatch = useDispatch();
  const { request, loading, error, message } = useSelector(
    (state) => state.requests
  );
  const { userDetails } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  const [transport, setTransport] = useState("");
  const [reqToUpdate, setReqToUpdate] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [useOtherTransport, setUseOtherTransport] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Insulated Bag w/ Ice Pack", value: "Insulated Bag w/ Ice Pack" },
    { label: "Cooler w/ Ice Pack", value: "Cooler w/ Ice Pack" },
    { label: "Styro box w/ Ice Pack", value: "Styro box w/ Ice Pack" },
  ]);

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);

  if (message) {
    Alert.alert("Success", message);
  }

  const filteredRequest = request.filter(
    (req) =>
      req.patient &&
      req.patient.patientType === "Outpatient" &&
      req.status !== "Done" &&
      req.status !== "Canceled"
  );

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getRequests()).finally(() => setRefreshing(false));
    dispatch(resetMessage());
  };

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

  const handleConfirm = () => {
    const data = {
      request: reqToUpdate,
      transport,
      dispenseAt: Date.now(),
      approvedBy: userDetails._id,
    };
    console.log(data);
    dispatch(outpatientDispense(data)).then(() => setModalVisible(false));
  };

  const handleReserve = (item) => {
    Alert.alert("Reserve Milk", "Reserve milk for this request?", [
      { text: "Cancel", style: "cancel" },
      { text: "", style: "cancel" },
      {
        text: "Reserve",
        style: "destructive",
        onPress: () => navigation.navigate("EditRequest", { request: item }),
      },
    ]);
  };

  const addRequest = () => {
    Alert.alert("Add Request", "Is the outpatient has a record in TCHMB?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "No",
        style: "destructive",
        onPress: () => navigation.navigate("AddPatient"),
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => navigation.navigate("AddRequest"),
      },
    ]);
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      {item.status === "Pending" ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleReserve(item)}
        >
          <MaterialIcons name="add-box" size={30} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.dispenseButton}
          onPress={() => {
            setReqToUpdate(item);
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="done-outline" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCard = (req) => {
    const { patient, volumeRequested, doctor, images } = req;
    const isReserved = req.status === "Reserved";

    return (
      <Swipeable
        key={req._id}
        renderRightActions={() => renderRightActions(req)}
      >
        <TouchableOpacity
          style={[
            styles.card,
            { borderColor: isReserved ? "#E53777" : "#FFA500", borderWidth: 2 },
          ]}
          onPress={() =>
            Alert.alert("Information", `Do you want to see other details?`, [
              { text: "Cancel", style: "cancel" },
              { text: "", style: "cancel" },
              {
                text: "Yes",
                onPress: () =>
                  navigation.navigate("RequestDetails", { request: req }),
              },
            ])
          }
        >
          <Text
            style={[
              styles.cardTitle,
              { color: isReserved ? "#E53777" : "#FFA500" },
            ]}
          >
            Status: {req.status}
          </Text>
          <Text>Date: {formatDate(req.date)}</Text>
          <Text>Patient: {patient.name}</Text>
          <Text>Type: {patient.patientType}</Text>
          <Text>Requested Volume: {volumeRequested.volume} mL/day</Text>
          <Text>Days: {volumeRequested.days}</Text>
          <Text>Prescribed By: {doctor}</Text>
          {images && images.length > 0 ? (
            <Image source={{ uri: images[0].url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <Text style={styles.screenTitle}>Outpatient Requests</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addRequest()}
        >
          <Text style={styles.buttonText}>
            <MaterialIcons name="add" size={16} color="white" /> Add
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.cardContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <SafeAreaView style={styles.form}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            filteredRequest.map((req) => renderCard(req))
          )}
        </SafeAreaView>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transportation method</Text>

            {!useOtherTransport ? (
              <DropDownPicker
                open={open}
                value={transport}
                items={items}
                setOpen={setOpen}
                setValue={setTransport}
                setItems={setItems}
                placeholder="Select Transportation Method"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Other method"
                value={transport}
                onChangeText={setTransport}
              />
            )}
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setUseOtherTransport(!useOtherTransport)}
              >
                <View style={styles.radioCircle}>
                  {useOtherTransport && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Other methods</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => handleConfirm()}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setTransport("");
                setReqToUpdate({});
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: 250,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    backgroundColor: "#FFA500",
  },
  dispenseButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    backgroundColor: "#E53777",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  reserveButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
  },
});

export default Outpatients;
