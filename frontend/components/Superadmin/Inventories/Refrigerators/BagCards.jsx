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
  const { item } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { allBags, loading, error } = useSelector((state) => state.bags);
  const { lettingDetails } = useSelector((state) => state.lettings);
  const { scheduleDetails } = useSelector((state) => state.schedules);

  useEffect(() => {
    dispatch(getAllBags())
    if (item.pubDetails) {
      dispatch(getLettingDetails(item.pubDetails._id));
    } else if (item.privDetails) {
      dispatch(getScheduleDetails(item.privDetails._id));
    }
  }, [dispatch, item]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(resetLettingDetails());
        dispatch(resetScheduleDetails());
      };
    }, [dispatch])
  );

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

  const renderCard = (bags, donor) => {
    return (
      <View>
        {bags.map((bag) => {
          const isSelected = selectedItems.includes(bag._id);
  
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              key={bag._id}
              onLongPress={() => {
                toggleSelectionMode();
              }}
              onPress={() => {
                if (selectionMode) {
                  toggleSelectItem(bag._id);
                }
              }}
            >
              <Text style={styles.cardTitle}>
                Date: {formatDate(bag.expressDate)}
              </Text>
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
          {lettingDetails?.attendance?.map((attendee) =>
            renderCard(attendee.bags, attendee.donor)
          )}
          {scheduleDetails?.donorDetails?.bags &&
            renderCard(
              scheduleDetails.donorDetails.bags,
              scheduleDetails.donorDetails.donorId
            )}
        </ScrollView>
      </View>
      {selectionMode && (
        <View style={styles.selectionFooter}>
          <Button
            title="Cancel"
            onPress={toggleSelectionMode}
            color="#FF3B30"
          />
          <Button
            title={`Next (${selectedItems.length} Selected)`}
            onPress={handleNavigate}
            disabled={selectedItems.length === 0}
          />
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
});

export default BagCards;
