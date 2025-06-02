import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import {
  approveSchedule,
  updateSchedule,
} from "../../../redux/actions/scheduleActions";

const Schedules = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);

  const handleEdit = (item) => {
    navigation.navigate("EditSchedule", { item });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // dispatch(deleteLetting(id))
            //   .then(
            //     Alert.alert("Deleted", "Schedule deleted successfully.")
            //   )
            //   .catch((err) => Alert.alert("Error", err.message));
            console.log("Deleted Schedule: ", id);
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEdit(item)}
      >
        <MaterialIcons name="edit" size={30} color="white" />
      </TouchableOpacity>
      {item.status !== "Completed" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item._id)}
        >
          <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleSave = (item) => {
    const updatedData = {
      scheduleId: item._id,
      venue: item.venue,
      newDate: item.dates,
      adminId: userDetails._id,
    };

    dispatch(approveSchedule(updatedData))
      .then(() => {
        Alert.alert("Success", "Schedule updated.");
        navigation.goBack();
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const handleApprove = (item) => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to approve this Schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "destructive",
          onPress: () => handleSave(item),
        },
      ]
    );
  };

  const handleCollect = (item) => {
    const data = {
      schedId: item._id,
      status: "Completed",
    };
    Alert.alert("Confirm Collection", "Is the express breastmilk collected?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(updateSchedule(data))
            .then(
              Alert.alert("Collectd", "Express breastmilk has been collected.")
            )
            .catch((err) => Alert.alert("Error", err.message));
        },
      },
    ]);
  };

  const renderSchedules = ({ item }) => {
    const { dates, address, donorDetails, totalVolume, status } = item;
    const isCompleted = status === "Completed";
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            status === "Pending" ? handleApprove(item) : handleCollect(item);
          }}
          disabled={isCompleted}
        >
          <View style={styles.info}>
            <Text style={styles.title}>
              Donor:{" "}
              {`${donorDetails?.donorId?.user?.name?.last}, ${donorDetails?.donorId?.user?.name?.first}`}
            </Text>
            <Text style={styles.title}>
              Phone: {donorDetails?.donorId?.user?.phone}
            </Text>
            <Text style={styles.details}>Venue: {address}</Text>
            <Text style={styles.details}>Status: {status}</Text>
            <Text style={styles.details}>Volume: {totalVolume}</Text>
            <Text style={styles.details}>
              Date: {moment(dates).format("MMMM Do YYYY")}
            </Text>
            <Text style={styles.details}>
              Time: {moment(dates).format("h:mm A")}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderSchedules}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
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
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  attendButton: {
    backgroundColor: "#E53777",
  },
  finalizeButton: {
    backgroundColor: "#4CAF50",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Schedules;
