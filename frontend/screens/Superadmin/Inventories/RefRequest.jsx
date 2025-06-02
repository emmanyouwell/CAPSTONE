import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getFridges } from "../../../redux/actions/fridgeActions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../../components/Superadmin/Header";
import { SuperAdmin } from "../../../styles/Styles";

const screenHeight = Dimensions.get("window").height;
const RefRequest = ({ route }) => {
  const { request } = route.params;
  const prevEbm = route.params.prevEbm ? route.params.prevEbm : [];
  const [refreshing, setRefreshing] = useState(false);
  const [ebm, setEbm] = useState(prevEbm);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { fridges, loading, error } = useSelector((state) => state.fridges);

  useEffect(() => {
    dispatch(getFridges());
  }, [dispatch]);

  useEffect(() => {
    if (prevEbm.length > 0) {
      setEbm(prevEbm);
    }
  }, [prevEbm]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setEbm([]);
      };
    }, [])
  );

  const handleNavigate = (fridge) => {
    navigation.navigate("PasteurCards", {
      fridge,
      request: request,
      prevEbm: ebm,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getFridges())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const renderFridgeCard = (item) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigate(item)}
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

  return (
    <View style={SuperAdmin.container}>
      <Header/>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
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
          <Text style={styles.requestText}>
            Patient Type: {request.patient.patientType}
          </Text>
          <Text style={styles.requestText}>Reason: {request.reason}</Text>
          <Text style={styles.requestText}>Diagnosis: {request.diagnosis}</Text>
          <Text style={styles.requestText}>
            Staff requested: {request.requestedBy?.name.last},{" "}
            {request.requestedBy?.name.first},
          </Text>
          <Text style={styles.requestText}>
            Required Volume: {request.volumeRequested.volume} mL/day
          </Text>
          <Text style={styles.requestText}>
            Days: {request.volumeRequested.days}
          </Text>
        </View>
      </ScrollView>
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

export default RefRequest;
