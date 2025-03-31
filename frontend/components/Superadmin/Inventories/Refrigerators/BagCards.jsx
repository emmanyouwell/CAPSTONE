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
import { logoutUser } from "../../../../redux/actions/userActions";
import { getAllBags } from "../../../../redux/actions/bagActions";
import { getLettingDetails } from "../../../../redux/actions/lettingActions";
import { resetLettingDetails } from "../../../../redux/slices/lettingSlice";
import { resetScheduleDetails } from "../../../../redux/slices/scheduleSlice";
import { getScheduleDetails } from "../../../../redux/actions/scheduleActions";
import { SuperAdmin } from "../../../../styles/Styles";
import { dataTableStyle } from "../../../../styles/Styles";

const BagCards = ({ route }) => {
  const { item, fridge } = route.params;
  const items = route.params.selectedItems ? route.params.selectedItems : [];
  const volLimit = route.params ? route.params.volLimit : 0;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [totalVolume, setTotalVolume] = useState(0);
  const [limit, setLimit] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tempVolume, setTempVolume] = useState(0);
  const [lastBagId, setLastBagId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { allBags, loading, error } = useSelector((state) => state.bags);
  const { lettingDetails } = useSelector((state) => state.lettings);
  const { scheduleDetails } = useSelector((state) => state.schedules);
  console.log("Temp: ", tempVolume);
  console.log("Last Bag Id: ", lastBagId)
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
    if (limit > 0 && totals > limit) {
      const excessVolume = totals - limit;
      alertExceedLimit(excessVolume);
      setTotalVolume(limit)
    } else {
      setTotalVolume(totals);
    }
  }, [selectedItems, allBags]);

  const alertExceedLimit = (excessVolume) => {
    Alert.alert(
      "Volume Limit Exceeded",
      `The total volume exceeds the limit by ${excessVolume} mL. Do you want to cut the excess?`,
      [
        {
          text: "No",
          onPress: () => {
            // Remove the last selected bag
            const updatedSelectedItems = [...selectedItems];
            updatedSelectedItems.pop();

            setSelectedItems(updatedSelectedItems);
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setTempVolume(Number(excessVolume));
          },
        },
      ]
    );
  };

  const handleToggleVolume = (vol) => {
    console.log(`${vol} ml limit`);
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
    setLastBagId(id);
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllBags());
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
    const selectedBags = allBags.filter((bag) =>
      selectedItems.includes(bag._id)
    );
    navigation.navigate("AddMilkInventory", { selectedBags });
  };

  const onLogoutPress = () => {
    dispatch(logoutUser())
      .then(() => {
        navigation.replace("login");
      })
      .catch((err) => console.log(err));
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
        {bags.map((bag) => {
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
              onLongPress={() => {
                if (!isPasteurized) showToggleSelectionOption();
              }}
              onPress={() => {
                if (!isPasteurized && selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
              disabled={isPasteurized}
            >
              <Text style={styles.cardTitle}>Status: {bag.status}</Text>
              <Text>Date: {formatDate(bag.expressDate)}</Text>
              <Text>Volume: {bag.volume} mL</Text>
              <Text>Donor: {donor?.user?.name?.last || "Unknown"}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLettingCard = (addBags, bags, donor, id) => {
    return (
      <View key={id}>
        {bags.map((bag) => {
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
              onLongPress={() => {
                if (!isPasteurized) showToggleSelectionOption();
              }}
              onPress={() => {
                if (!isPasteurized && selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
              disabled={isPasteurized}
            >
              <Text style={styles.cardTitle}>Status: {bag.status}</Text>
              <Text>Date: {formatDate(bag.expressDate)}</Text>
              <Text>Volume: {bag.volume} mL</Text>
              <Text>Donor: {donor?.user?.name?.last || "Unknown"}</Text>
            </TouchableOpacity>
          );
        })}
        {addBags?.map((bag) => {
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
              onLongPress={() => {
                if (!isPasteurized) showToggleSelectionOption();
              }}
              onPress={() => {
                if (!isPasteurized && selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
              disabled={isPasteurized}
            >
              <Text style={styles.cardTitle}>Status: {bag.status}</Text>
              <Text>Date: {formatDate(bag.expressDate)}</Text>
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
      <Header
        onLogoutPress={() => onLogoutPress()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <Text style={styles.screenTitle}>Bags in the collection</Text>
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
              scheduleDetails.donorDetails.donorId
            )}
        </ScrollView>
      </View>
      {selectionMode && (
        <View style={styles.selectionFooter}>
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>
              Total Volume to Pasteur: {totalVolume} mL
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
});

export default BagCards;
