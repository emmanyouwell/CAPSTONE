import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../Header";
import { getAllBags } from "../../../../redux/actions/bagActions";
import { getLettingDetails } from "../../../../redux/actions/lettingActions";
import { resetLettingDetails } from "../../../../redux/slices/lettingSlice";
import { resetScheduleDetails } from "../../../../redux/slices/scheduleSlice";
import { getScheduleDetails } from "../../../../redux/actions/scheduleActions";
import { SuperAdmin } from "../../../../styles/Styles";
import { dataTableStyle } from "../../../../styles/Styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const BagCards = ({ route }) => {
  const { item, fridge, stored } = route.params;
  const items = route.params.selectedItems ? route.params.selectedItems : [];
  const volLimit = route.params ? route.params.volLimit : 0;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [totalVolume, setTotalVolume] = useState(0);
  const [limit, setLimit] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { allBags, loading, error } = useSelector((state) => state.bags);
  const { lettingDetails } = useSelector((state) => state.lettings);
  const { scheduleDetails } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (item.pubDetails) {
      dispatch(getLettingDetails(item.pubDetails._id));
    } else if (item.privDetails) {
      dispatch(getScheduleDetails(item.privDetails._id));
    }
  }, [dispatch, item]);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems([...items]);
      setSelectionMode(true);
    }
    if (volLimit) {
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

  const alertBelowLimit = (volume) => {
    Alert.alert(
      "Milk volume not met!",
      `The total milk volume needed to pasteurize is not yet reached. Please select more milk bags!`
    );
  };

  const handleToggleVolume = (vol) => {
    setLimit(Number(vol));
    toggleSelectionMode();
  };

  const showToggleSelectionOption = () => {
    Alert.alert(
      "2000ml or 4000ml",
      "How many milk (ml) do you want to pasteurize?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "2000", onPress: () => handleToggleVolume(2000) },
        { text: "4000", onPress: () => handleToggleVolume(4000) },
      ]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllBags());
    setTotalVolume(0);
    if (item.pubDetails) {
      dispatch(getLettingDetails(item.pubDetails._id))
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false));
    } else if (item.privDetails) {
      dispatch(getScheduleDetails(item.privDetails._id))
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false));
    }
  };

  const handleNavigate = () => {
    if (totalVolume < limit) {
      alertBelowLimit(totalVolume);
      return;
    }
    const selectedBags = allBags.filter((bag) =>
      selectedItems.includes(bag._id)
    );
    navigation.navigate("AddMilkInventory", {
      selectedBags,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(resetLettingDetails());
        dispatch(resetScheduleDetails());
        setLimit(0);
      };
    }, [dispatch])
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

  const renderSchedCard = (bags, donor, id) => {
    return (
      <View key={id}>
        {bags?.map((bag) => {
          const isSelected = selectedItems.includes(bag._id);
          const isPasteurized = bag.status === "Pasteurized";

          return (
            <TouchableOpacity
              key={bag._id}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
                isPasteurized && styles.disabledCard,
              ]}
              onPress={() => {
                if (!isPasteurized && selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
              disabled={isPasteurized}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>Status: {bag.status}</Text>
                  <Text>Express Date: {formatDate(bag.expressDate)}</Text>
                  <Text>Volume: {bag.volume} mL</Text>
                  <Text>Donor: {donor?.user?.name?.last || "Unknown"}</Text>
                </View>

                {!stored && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("bagDetails", { id: bag._id, collectionId: id })
                    }
                    style={styles.editIcon}
                  >
                    <MaterialIcons name="edit" size={24} color="#007AFF" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLettingCard = (addBags, bags, donor, id) => {
    const collectionBags = [...bags, ...addBags];
    return (
      <View key={id}>
        {collectionBags?.map((bag) => {
          const isSelected = selectedItems.includes(bag._id);
          const isPasteurized = bag.status === "Pasteurized";

          return (
            <TouchableOpacity
              key={bag._id}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
                isPasteurized && styles.disabledCard,
              ]}
              onPress={() => {
                if (!isPasteurized && selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
              disabled={isPasteurized}
            >
              <Text style={styles.cardTitle}>Status: {bag.status}</Text>
              <Text>Express Date: {formatDate(bag.expressDate)}</Text>
              <Text>Volume: {bag.volume} mL</Text>
              <Text>Donor: {donor?.user?.name?.last || "Unknown"}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={SuperAdmin.container}>
      <Header />
      <Text style={styles.screenTitle}>Bags in the collection</Text>
      {stored && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => showToggleSelectionOption()}
          >
            <Text style={styles.buttonText}>
              <MaterialIcons name="add" size={16} color="white" /> Pasteurize
              milk bags
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
          {lettingDetails?.attendance?.map((attendee) => {
            return renderLettingCard(
              attendee?.additionalBags,
              attendee.bags,
              attendee.donor,
              attendee._id
            );
          })}
          {scheduleDetails?.donorDetails?.bags &&
            renderSchedCard(
              scheduleDetails.donorDetails.bags,
              scheduleDetails.donorDetails.donorId,
              scheduleDetails._id
            )}
        </ScrollView>
      </View>
      {selectionMode && (
        <View style={styles.selectionFooter}>
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>
              Total Volume to Pasteur: {totalVolume}/{limit} mL
            </Text>
          </View>
          <View style={styles.footerButtons}>
            <Button
              title="Cancel"
              onPress={toggleSelectionMode}
              color="#FF3B30"
            />
            <Button
              title="Back"
              onPress={() =>
                navigation.navigate("InventoryCards", {
                  selectedItems: selectedItems,
                  fridge: fridge,
                  volLimit: limit,
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
    backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e9",
  },
  disabledCard: {
    backgroundColor: "#e0e0e0",
    borderColor: "#9e9e9e",
    opacity: 0.6,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
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
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editIcon: {
    padding: 6,
  },
});

export default BagCards;
