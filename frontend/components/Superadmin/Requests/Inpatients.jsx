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
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../Header";
import { logoutUser } from "../../../redux/actions/userActions";
import { SuperAdmin } from "../../../styles/Styles";
import { getRequests } from "../../../redux/actions/requestActions";

const Inpatients = ({ navigation }) => {
  const dispatch = useDispatch();
  const { request, loading, error } = useSelector((state) => state.requests);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);
  
  const filteredRequest = request.filter(
    (req) => req.patient && req.patient.patientType === 'Inpatient' && req.status === 'Pending' || req.status === 'Reserved'
  );

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getRequests()).finally(() => setRefreshing(false));
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

  const handleReserve = (item) => {
    Alert.alert("Reserve Milk", "Reserve milk for this request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reserve",
        style: "destructive",
        onPress: () => navigation.navigate("EditRequest", { request: item })
      },
    ]);
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleReserve(item)}
      >
        <MaterialIcons name="add-box" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderCard = (req) => {
    const { patient, volume, doctor, images } = req;
    const isReserved = req.status === 'Reserved';
  
    return (
      <Swipeable renderRightActions={() =>
        isReserved ? null : renderRightActions(req)
      }>
        <TouchableOpacity
          key={req._id}
          style={[
            styles.card,
            { borderColor: isReserved ? "#E53777" : "#FFA500", borderWidth: 2 }
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
          <Text style={[styles.cardTitle, { color: isReserved ? "#E53777" : "#FFA500" }]}>
            Status: {req.status}
          </Text>
          <Text>Date: {formatDate(req.date)}</Text>
          <Text>Patient: {patient.name}</Text>
          <Text>Type: {patient.patientType}</Text>
          <Text>Requested Volume: {volume} mL</Text>
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
      <Text style={styles.screenTitle}>Inpatient Requests</Text>
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
    backgroundColor: "#E53777",
  },
});

export default Inpatients;