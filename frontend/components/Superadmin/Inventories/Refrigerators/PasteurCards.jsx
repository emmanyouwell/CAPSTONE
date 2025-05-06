import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Header from "../../Header";
import { logoutUser } from "../../../../redux/actions/userActions";
import { getInventories } from "../../../../redux/actions/inventoryActions";
import { SuperAdmin } from "../../../../styles/Styles";
import { dataTableStyle } from "../../../../styles/Styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const screenHeight = Dimensions.get("window").height;
const PasteurCards = ({ route }) => {
  const { fridge } = route.params ? route.params : null;
  const { request } = route.params ? route.params : null;
  const otherEBM = route.params.prevEbm ? route.params.prevEbm : [];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { inventory, loading, error } = useSelector(
    (state) => state.inventories
  );
  const [refreshing, setRefreshing] = useState(false);
  const [ebm, setEbm] = useState(otherEBM);
  const [startBottle, setStartBottle] = useState("");
  const [endBottle, setEndBottle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  useEffect(() => {
    dispatch(getInventories());
  }, [dispatch]);

  useEffect(() => {
    if (otherEBM > 0) {
      setEbm(otherEBM);
    }
  }, [otherEBM]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getInventories())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const handleOpenModal = (inv) => {
    setSelectedInventory(inv);
    setModalVisible(true);
  };

  const confirmReservation = () => {
    navigation.navigate("ConfirmBottleReserve", { ebm, request, fridge });
  };

  const handleReserve = () => {
    if (!selectedInventory) return;

    const start = parseInt(startBottle.trim());
    const end = parseInt(endBottle.trim());

    if (!start || !end || start > end) {
      Alert.alert("Invalid Input", "Enter a valid bottle range.");
      return;
    }

    const availableBottles =
      selectedInventory.pasteurizedDetails.bottles.filter(
        (bot) => bot.status === "Available"
      );

    if (availableBottles.length === 0) {
      Alert.alert("No Available Bottles", "There are no available bottles.");
      return;
    }

    const maxAvailableBottleNumber = Math.max(
      ...availableBottles.map((bot) => bot.bottleNumber)
    );

    const minAvailableBottleNumber = Math.min(
      ...availableBottles.map((bot) => bot.bottleNumber)
    );
    if (start < minAvailableBottleNumber) {
      Alert.alert(
        "Start Range Too Low",
        `The lowest available bottle number is ${minAvailableBottleNumber}. Please adjust your selection.`
      );
      return;
    }

    if (end > maxAvailableBottleNumber) {
      Alert.alert(
        "End Range Too High",
        `The highest available bottle number is ${maxAvailableBottleNumber}. Please adjust your selection.`
      );
      return;
    }

    const selectedBottles = availableBottles.filter(
      (bot) => bot.bottleNumber >= start && bot.bottleNumber <= end
    );

    if (selectedBottles.length === 0) {
      Alert.alert(
        "No Available Bottles",
        "No bottles are available in this range."
      );
      return;
    }
    const ebmDetails = {
      invId: selectedInventory._id,
      bottleType: selectedInventory.pasteurizedDetails.bottleType,
      batch: selectedInventory.pasteurizedDetails.batch,
      pool: selectedInventory.pasteurizedDetails.pool,
      bottle: { start: start, end: end },
      volDischarge: Number(
        selectedBottles.length * selectedInventory.pasteurizedDetails.bottleType
      ),
    };
    // console.log(ebmDetails)
    setEbm((prevEbm) => [...prevEbm, ebmDetails]);
    setModalVisible(false);
    setStartBottle("");
    setEndBottle("");
  };

  const filteredInventories = inventory.filter(
    (inv) =>
      inv.fridge &&
      inv.fridge._id === fridge._id &&
      inv.status !== "Unavailable"
  );

  const bottlesSelected = ebm?.reduce((total, e) => {
    return total + (e.bottle.end - e.bottle.start + 1);
  }, 0);

  const renderCard = (inv) => {
    const details =
      fridge.fridgeType === "Pasteurized" ? inv.pasteurizedDetails : null;

    const availBottles = details?.bottles.filter(
      (bot) => bot.status === "Available"
    );

    const maxBottle = Math.max(...availBottles.map((bot) => bot.bottleNumber));

    const minBottle = Math.min(...availBottles.map((bot) => bot.bottleNumber));

    return (
      <TouchableOpacity
        key={inv._id}
        style={styles.card}
        onPress={() => handleOpenModal(inv)}
        disabled={!request || inv.status === "Reserved"}
      >
        <Text style={styles.cardTitle}>{formatDate(inv.inventoryDate)}</Text>
        {inv.status === "Available" ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{inv.status}</Text>
          </View>
        ) : (
          <View style={styles.statusBadge2}>
            <Text style={styles.statusText}>{inv.status}</Text>
          </View>
        )}
        {details && fridge.fridgeType === "Pasteurized" ? (
          <>
            <Text style={styles.cardText}>Batch: {details.batch}</Text>
            <Text style={styles.cardText}>Pool: {details.pool}</Text>
            {inv.status === "Available" ? (
              <Text style={styles.cardText}>
                Bottles Available: {minBottle} - {maxBottle}
              </Text>
            ) : (
              <Text style={styles.cardText}>
                Bottles: {details.bottles.length}
              </Text>
            )}
            <Text style={styles.cardText}>
              Bottle Type: {details.bottleType} mL
            </Text>
            <Text style={styles.cardText}>
              Expiration: {formatDate(details.expiration)}
            </Text>
          </>
        ) : (
          <Text style={styles.cardText}>No details available</Text>
        )}
      </TouchableOpacity>
    );
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
        navigation.navigate("login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={SuperAdmin.container}>
      <Header
        onLogoutPress={() => onLogoutPress()}
        onMenuPress={() => navigation.openDrawer()}
      />

      <Text style={styles.screenTitle}>{fridge.name} Batches</Text>
      <ScrollView>
        {!request && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate("FridgeDetails", fridge)}
              >
                <Text style={styles.buttonText}>
                  <MaterialIcons name="history" size={16} color="white" />{" "}
                  History
                </Text>
              </TouchableOpacity>
            </View>
            <View style={dataTableStyle.tableContainer}>
              <ScrollView
                style={styles.cardContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              >
                {filteredInventories.map((inv) => renderCard(inv))}
              </ScrollView>
            </View>
          </>
        )}

        {request && (
          <>
            <View style={styles.tableContainer}>
              <FlatList
                data={filteredInventories}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item._id}
                horizontal
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </View>
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
                Staff Requested: {request.requestedBy?.name.last},{" "}
                {request.requestedBy?.name.first}
              </Text>
              <Text style={styles.requestText}>
                Required Volume: {request.volumeRequested.volume} mL/day
              </Text>
              <Text style={styles.requestText}>
                Days: {request.volumeRequested.days}
              </Text>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Reserve Bottles</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Start Bottle Number"
                    keyboardType="numeric"
                    value={startBottle}
                    onChangeText={setStartBottle}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="End Bottle Number"
                    keyboardType="numeric"
                    value={endBottle}
                    onChangeText={setEndBottle}
                  />

                  <TouchableOpacity
                    style={styles.reserveButton}
                    onPress={handleReserve}
                  >
                    <Text style={styles.buttonText}>Reserve Bottles</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setModalVisible(false);
                      setStartBottle("");
                      setEndBottle("");
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </ScrollView>
      {ebm.length !== 0 && (
        <>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmReservation}
          >
            <Text style={styles.buttonText}>
              Reserve {bottlesSelected} bottles
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fridgeButton}
            onPress={() =>
              navigation.navigate("RefRequest", {
                request: request,
                prevEbm: ebm,
              })
            }
          >
            <Text style={styles.buttonText}>Select from another fridge</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              setEbm([]);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  statusBadge2: {
    backgroundColor: "#E53777",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    marginLeft: 10,
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
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  fridgeButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cancel: {
    backgroundColor: "red",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
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
  tableContainer: {
    height: screenHeight / 2.5,
    borderColor: "rgba(5,0,3,0.5)",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 10,
  },
});

export default PasteurCards;
