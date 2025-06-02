import React, { useEffect, useState } from "react";
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
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import Header from "../../Header";
import { SuperAdmin } from "../../../../styles/Styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { allCollections } from "../../../../redux/actions/collectionActions";
import { addInventory } from "../../../../redux/actions/inventoryActions";

const StoreCollections = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const fridge = route.params.selectedBags
    ? { fridgeType: "Pasteurized" }
    : route.params;
  const { collections, loading, error } = useSelector(
    (state) => state.collections
  );
  const { userDetails } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(allCollections());
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(allCollections())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const handleSubmit = async (item) => {
    if (!item) {
      Alert.alert("Error", "Collection Not Found");
      return;
    }

    if (!userDetails || !userDetails._id) {
      Alert.alert("Error", "Failed to retrieve user details.");
      return;
    }

    const newData = {
      fridgeId: fridge._id,
      userId: userDetails._id,
    };

    if (fridge.fridgeType === "Unpasteurized") {
      const { _id } = item;

      if (!_id) {
        Alert.alert(
          "Error",
          "Not Found"
        );
        return;
      }

      newData.unpasteurizedDetails = {
        collectionId: _id
      };

      try {
        dispatch(addInventory(newData));
        console.log(newData);
        Alert.alert("Success", "Collection has been stored.");

        // navigation.goBack();
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

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.addButton]}
        onPress={() => handleSubmit(item)}
      >
        <MaterialIcons name="add-box" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  const filteredCollections = collections.filter(
    (coll) => coll.status === "Collected"
  );

  const renderCollections = ({ item }) => {
    const { collectionType, collectionDate, pubDetails, privDetails, status } =
      item;
    console.log(pubDetails);
    console.log(privDetails);
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.title}>{formatDate(collectionDate)}</Text>
            <Text style={styles.details}>Type: {collectionType}</Text>
            <Text style={styles.details}>Status: {status}</Text>
            {collectionType === "Public" ? (
              <>
                <Text style={styles.details}>
                  Donors: {pubDetails?.attendance?.length}
                </Text>
                <Text style={styles.details}>
                  Volume Collected: {pubDetails?.totalVolume}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.details}>
                  Donor: {privDetails?.donorDetails?.donorId.user.name.last},{" "}
                  {privDetails?.donorDetails?.donorId.user.name.first}
                </Text>
                <Text style={styles.details}>
                  Volume Collected: {privDetails.totalVolume} ml
                </Text>
              </>
            )}
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={SuperAdmin.container}>
      <Header/>

      <Text style={styles.screenTitle}>Collected milk to store</Text>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <SafeAreaView style={styles.form}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={filteredCollections}
              keyExtractor={(item) => item._id}
              renderItem={renderCollections}
              contentContainerStyle={styles.container}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

// Helper function to format date
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
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: 100,
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
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
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
  },
  addButton: {
    backgroundColor: "#E53777",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StoreCollections;
