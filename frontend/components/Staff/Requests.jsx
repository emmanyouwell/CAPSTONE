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
import { useDispatch } from "react-redux";
import { deleteRequest } from "../../redux/actions/requestActions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Requests = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleEdit = (item) => {
    console.log("Edit: ", item);
    navigation.navigate('EditStaffRequest', { request: item });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this equipment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteRequest(id))
              .then(Alert.alert("Deleted", "Request deleted successfully."))
              .catch((err) => Alert.alert("Error", err.message));
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
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item._id)}
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderRequest = ({ item }) => {
    const { status, date, patient, volumeRequested, images, doctor } = item;

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          key={item._id}
          style={styles.card}
          onPress={() => {
            console.log("Item: ", item)
            Alert.alert(
              "Clicked",
              `Clicked Request`,
              [
                { text: "Cancel", style: "cancel" },
              ]
            )}
          }
        >
          {images && images.length > 0 ? (
            <Image source={{ uri: images[0].url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.title}>{status}</Text>
            <Text style={styles.details}>Date: {formatDate(date)}</Text>
            <Text style={styles.details}>Patient: {patient.name}</Text>
            <Text style={styles.details}>
            Volume: {volumeRequested.volume} mL
            </Text>
            <Text style={styles.details}>Days: {volumeRequested.days}</Text>
            <Text style={styles.details}>Prescribed By: {doctor}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderRequest}
      contentContainerStyle={styles.container}
    />
  );
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
    height: 155,
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
    backgroundColor: "#4CAF50",
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

export default Requests;
