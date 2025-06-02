import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Button,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Header from "../../Header";
import { checkInventories, getInventories } from "../../../../redux/actions/inventoryActions";
import { SuperAdmin } from "../../../../styles/Styles";
import { dataTableStyle } from "../../../../styles/Styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Inventory = ({ route }) => {
  const { fridge } = route.params;
  const items = route.params.selectedItems ? route.params.selectedItems : [];
  const volLimit = route.params ? route.params.volLimit : 0;
  const [selectedItems, setSelectedItems] = useState(items);
  const [limit, setLimit] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { inventory, loading, error, message } = useSelector(
    (state) => state.inventories
  );
  const { allBags } = useSelector((state) => state.bags);
 console.log("Message: ", message)
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getInventories());
    dispatch(checkInventories());
  }, [dispatch]);

  useEffect(() => {
      if (items.length > 0) {
        setSelectedItems(items);
      }
      if(volLimit){
        setLimit(volLimit);
      }
    }, [items, volLimit]);

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

  const handleRefresh = () => {
    dispatch(checkInventories())
    setRefreshing(true);
    dispatch(getInventories())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const filteredInventories = inventory.filter(
    (inv) =>
      inv.fridge && inv.fridge._id === fridge._id && inv.status === "Available"
  );

  const renderCard = (inv) => {
    const details =
      fridge.fridgeType === "Pasteurized"
        ? inv.pasteurizedDetails
        : inv.unpasteurizedDetails;
    return (
      <TouchableOpacity
        key={inv._id}
        style={styles.card}
        onPress={() =>
          navigation.navigate("BagCards", {
            item: inv.unpasteurizedDetails.collectionId,
            fridge: fridge,
            selectedItems: selectedItems,
            volLimit: limit,
            stored: true
          })
        }
      >
        <Text style={styles.cardTitle}>
          Inventory Date: {formatDate(inv.inventoryDate)}
        </Text>
        <Text>Status: {inv.status}</Text>
        <Text>Collection Type: {details?.collectionId.collectionType}</Text>
        {details && (
          <>
            <Text>
              Express Date Start: {formatDate(details.expressDateStart)}
            </Text>
            <Text>Express Date End: {formatDate(details.expressDateEnd)}</Text>
            {details?.collectionId.collectionType === "Public" ? (
              <Text>
                Volume: {details.collectionId?.pubDetails?.totalVolume} mL
              </Text>
            ) : (
              <Text>
                Volume: {details.collectionId?.privDetails?.totalVolume} mL
              </Text>
            )}
          </>
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

  const handleNavigate = () => {
    const selectedBags = allBags.filter((bag) =>
      selectedItems.includes(bag._id)
    );
    navigation.navigate("AddMilkInventory", { selectedBags });
  };

  return (
    <View style={SuperAdmin.container}>
      <Header/>
      <Text style={styles.screenTitle}>{fridge.name} Stored Milk</Text>
      {selectedItems.length === 0 && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("FridgeDetails", fridge)}
          >
            <Text style={styles.buttonText}>
              <MaterialIcons name="history" size={16} color="white" /> History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("StoreCollections", fridge)}
          >
            <Text style={styles.buttonText}>
              <MaterialIcons name="add" size={16} color="white" /> Add
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={dataTableStyle.tableContainer}>
        <ScrollView
          style={styles.cardContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredInventories.map((inv) => renderCard(inv))}
        </ScrollView>
      </View>
      {selectedItems && selectedItems.length > 0 && (
        <View style={styles.selectionFooter}>
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>
              Total Volume to Pasteur: {totalVolume} mL
            </Text>
          </View>
          <View style={styles.footerButtons}>
            <Button
              title="Cancel"
              onPress={() => setSelectedItems([])}
              color="#FF3B30"
            />
            <Button
              title="Back"
              onPress={() =>
                navigation.navigate("superadmin_fridges", {
                  request: null,
                  selectedItems: selectedItems,
                  fridge: fridge,
                  volLimit: limit
                })
              }
              color="#E53777"
            />
            <Button
              title={`Next (${selectedItems.length} Selected)`}
              onPress={handleNavigate}
              disabled={selectedItems.length === 0}
            />
          </View>
        </View>
      )}
    </View>
  );
};

// Helper function to format date
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
  selectedCard: {
    backgroundColor: "#D1E7FF",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
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
});

export default Inventory;
