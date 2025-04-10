import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import Header from "../../components/Superadmin/Header";
import { logoutUser } from "../../redux/actions/userActions";
import { SuperAdmin, colors } from "../../styles/Styles";

const RequestDetails = ({ navigation, route }) => {
  const { request } = route.params;

  const totalBottles = request.tchmb.ebm?.reduce((total, e) => {
    return total + (e.bottle.end - e.bottle.start + 1);
  }, 0);
  const totalVolume = request.tchmb.ebm?.reduce((total, e) => {
    return total + e.volDischarge;
  }, 0);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0); // Track which image is opened

  const openImageViewer = (index) => {
    setSelectedImages(request.images.map((img) => ({ uri: img.url })));
    setImageIndex(index); // Set the clicked image index
    setIsVisible(true);
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

  return (
    <SafeAreaView style={SuperAdmin.container}>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Request Details</Text>
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

        {/* Attached Images */}
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

        {/* Full-Screen Image Viewer */}
        <ImageViewing
          images={selectedImages}
          imageIndex={imageIndex} // Use the dynamically set index
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />

        {/* TCHMB Details */}
        <Text style={styles.sectionTitle}>TCHMB Details</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bottles</Text>
          {request.tchmb.ebm?.map((e, index) => (
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default RequestDetails;
