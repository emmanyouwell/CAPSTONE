import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ImageViewing from "react-native-image-viewing";
import Header from "../../Header";
import { SuperAdmin, colors } from "../../../../styles/Styles";
import { reserveInventory } from "../../../../redux/actions/inventoryActions";

const ConfirmBottleReserve = ({ navigation, route }) => {
  const { ebm, request } = route.params;
  const dispatch = useDispatch();
  const totalBottles = ebm?.reduce((total, e) => {
    return total + (e.bottle.end - e.bottle.start + 1);
  }, 0);
  const totalVolume = ebm?.reduce((total, e) => {
    return total + e.volDischarge;
  }, 0);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const openImageViewer = (index) => {
    setSelectedImages(request.images.map((img) => ({ uri: img.url })));
    setImageIndex(index);
    setIsVisible(true);
  };

  const handleConfirm = () => {
    if (!request) {
      Alert.alert("Error", "Request is required");
      return;
    }
    if (ebm.length === 0) {
      Alert.alert("Error", "EBM is required");
      return;
    }
    const data = {
      id: request._id,
      ebmData: ebm,
    };
    dispatch(reserveInventory(data))
      .then(() => {
        Alert.alert("Success", "The bottles are reserved");
        if(request.patient.patientType === 'Inpatient'){
          navigation.navigate('Inpatients')
        } else {
          navigation.navigate('Outpatients')
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={SuperAdmin.container}>
      <Header/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Confirm Reservation</Text>
        {request.patient.patientType === "Inpatient" && (
          <View style={styles.card}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{request.department}</Text>
          </View>
        )}

        {/* Request Information */}
        {[
          { label: "Diagnosis", value: request.diagnosis },
          { label: "Doctor", value: request.doctor },
          { label: "Hospital", value: request.hospital },
          { label: "Patient Name", value: request.patient.name },
          { label: "Patient Type", value: request.patient.patientType },
          {
            label: "Requested By",
            value: `${request.requestedBy.name.first} ${request.requestedBy.name.last}`,
          },
          { label: "Reason", value: request.reason },
          { label: "Status", value: request.status, status: true },
          {
            label: "Volume Requested",
            value: `${request.volumeRequested.volume}ml for ${request.volumeRequested.days} days`,
          },
        ].map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text
              style={[
                styles.value,
                item.status && {
                  color:
                    item.value === "Pending"
                      ? "orange"
                      : item.value === "Canceled"
                      ? colors.color2
                      : colors.color8_dgreen,
                },
              ]}
            >
              {item.value}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Attached Images</Text>
        <View style={styles.imageContainer}>
          {request.images.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openImageViewer(index)}
            >
              <Image source={{ uri: img.url }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>

        <ImageViewing
          images={selectedImages}
          imageIndex={imageIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />

        {/* TCHMB Details */}
        <Text style={styles.sectionTitle}>Reservation Details</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bottles</Text>
          {ebm?.map((e, index) => (
            <View key={index} style={styles.ebmCard}>
              <Text style={styles.ebmBottle}>
                Bottles {e.bottle.start} - {e.bottle.end}
              </Text>
              <Text>Batch: {e.batch}</Text>
              <Text>Pool: {e.pool}</Text>
              <Text>Bottle Type: {e.bottleType}</Text>
            </View>
          ))}
          <Text style={styles.totalVolume}>Total Bottles: {totalBottles}</Text>
          <Text style={styles.totalVolume}>Total Volume: {totalVolume} mL</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Reservation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.color1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: colors.color12_dpurple,
  },
  card: {
    backgroundColor: colors.color6,
    padding: 15,
    borderRadius: 12,
    shadowColor: colors.color7_black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.color3,
  },
  value: {
    fontSize: 16,
    color: colors.color7_black,
    marginTop: 4,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    margin: 5,
    borderWidth: 2,
    borderColor: colors.color1_dark,
  },
  ebmCard: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  ebmBottle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  totalVolume: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmBottleReserve;
