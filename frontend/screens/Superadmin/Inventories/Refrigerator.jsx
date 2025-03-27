import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Button,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  getFridges,
  deleteFridges,
} from "../../../redux/actions/fridgeActions";
import { getAllBags } from "../../../redux/actions/bagActions";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Superadmin/Header";
import { dataTableStyle } from "../../../styles/Styles";
import { logoutUser } from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";

const screenHeight = Dimensions.get("window").height;
const Refrigerator = ({ route }) => {
  const request = route.params ? route.params.request : null;

  const items = route.params ? route.params.selectedItems : [];
  const [selectedItems, setSelectedItems] = useState(items);
  const [totalVolume, setTotalVolume] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { fridges, loading, error } = useSelector((state) => state.fridges);
  const { allBags } = useSelector((state) => state.bags);

  useEffect(() => {
    dispatch(getFridges());
    dispatch(getAllBags());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(items);
    }
  }, [items]);

  useEffect(() => {
    const selectedBags = allBags.filter((bag) =>
      selectedItems.includes(bag._id)
    );
    const totals = selectedBags.reduce(
      (total, item) => total + (Number(item.volume) || 0),
      0
    );
    setTotalVolume(totals);
  }, [selectedItems, allBags]);

  const handleNavigate = (fridge) => {
    if (fridge.fridgeType === "Pasteurized") {
      navigation.navigate("PasteurCards", { fridge, request });
    } else {
      navigation.navigate("InventoryCards", {
        fridge,
        selectedItems: selectedItems,
      });
    }
  };

  const showEditDeleteOptions = (item) => {
    Alert.alert(
      "Edit or Delete Fridge",
      `What would you like to do with ${item.name}?`,
      [
        { text: "Edit", onPress: () => handleEdit(item) },
        { text: "Delete", onPress: () => handleDelete(item._id) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate("EditFridge", { fridge: item });
  };

  const handleDelete = (fridgeId) => {
    dispatch(deleteFridges(fridgeId))
      .then(() => {
        Alert.alert("Success", "Fridge deleted successfully.");
        dispatch(getFridges());
      })
      .catch((err) => {
        Alert.alert("Error", "Failed to delete the fridge.");
      });
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

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllBags());
    dispatch(getFridges())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const handleAddMilk = () => {
    const selectedBags = allBags.filter((bag) =>
      selectedItems.includes(bag._id)
    );
    navigation.navigate("AddMilkInventory", { selectedBags });
  };

  const renderFridgeCard = (item) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigate(item)}
      onLongPress={() => showEditDeleteOptions(item)}
      key={item._id}
    >
      <Text style={styles.fridgeName}>{item.name}</Text>
    </TouchableOpacity>
  );

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

  const pasteurizedFridges = fridges
    ? fridges.filter((f) => f.fridgeType === "Pasteurized")
    : [];
  const unpasteurizedFridges = fridges
    ? fridges.filter((f) => f.fridgeType === "Unpasteurized")
    : [];

  return (
    <View style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      {request ? (
        <>
          <View style={styles.section}>
            <Text style={styles.screenTitle}>Select Pasteurized Fridges</Text>
            {pasteurizedFridges.length > 0 ? (
              <FlatList
                data={pasteurizedFridges}
                renderItem={({ item }) => renderFridgeCard(item)}
                keyExtractor={(item) => item._id}
                horizontal
              />
            ) : (
              <Text style={styles.noFridgeText}>
                No Pasteurized Fridges Available
              </Text>
            )}
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
            <Text style={styles.requestText}>Reason: {request.reason}</Text>
            <Text style={styles.requestText}>
              Diagnosis: {request.diagnosis}
            </Text>
            <Text style={styles.requestText}>
              Required Volume: {request.volume} mL/day
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.screenTitle}>Refrigerator Management</Text>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddFridge")}
              >
                <Text style={styles.buttonText}>
                  <MaterialIcons name="add" size={16} color="white" /> Add
                  Fridge
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pasteurized Fridges</Text>
              <View style={styles.tableContainer}>
                {pasteurizedFridges.length > 0 ? (
                  <FlatList
                    data={pasteurizedFridges}
                    renderItem={({ item }) => renderFridgeCard(item)}
                    keyExtractor={(item) => item._id}
                    vertical
                    style={styles.cardContainer}
                  />
                ) : (
                  <Text style={styles.noFridgeText}>
                    No Pasteurized Fridges Available
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Unpasteurized Fridges</Text>
              <View style={styles.tableContainer}>
                {unpasteurizedFridges.length > 0 ? (
                  <FlatList
                    data={unpasteurizedFridges}
                    renderItem={({ item }) => renderFridgeCard(item)}
                    keyExtractor={(item) => item._id}
                    vertical
                    style={styles.cardContainer}
                  />
                ) : (
                  <Text style={styles.noFridgeText}>
                    No Unpasteurized Fridges Available
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          {selectedItems && selectedItems.length > 0 && (
            <View style={styles.selectionFooter}>
              <View style={styles.footerDetails}>
                <Text style={styles.footerText}>
                  Total Volume to Pasteur: {totalVolume} mL
                </Text>
              </View>
              <Button
                title="Cancel"
                onPress={() => setSelectedItems([])}
                color="#FF3B30"
              />
              <Button
                title={`Next (${selectedItems.length} Selected)`}
                onPress={handleAddMilk}
                disabled={selectedItems.length === 0}
              />
            </View>
          )}
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
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
  fridgeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fridgeCapacity: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noFridgeText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 8,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
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
  selectionFooter: {
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderTopWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    marginTop: 10,
  },
  footerDetails: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    marginBottom: 10,
  },
  footerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007AFF",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableContainer: {
    height: screenHeight / 5,
    borderColor: "#E53777",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 5,
  },
});

export default Refrigerator;
