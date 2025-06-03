import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-paper";
import { formatDate } from "../../utils/helper";

const DonorRecordTable = ({ donors }) => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (donor) => {
    setSelectedDonor(donor);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDonor(null);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {donors.map((donor, index) => (
        <TouchableOpacity key={index} onPress={() => openModal(donor)}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.name}>
                {donor.user?.name?.first} {donor.user?.name?.last}
              </Text>
              <Text style={styles.label}>
                Donor Type: <Text style={styles.value}>{donor.donorType}</Text>
              </Text>
              <Text style={styles.label}>
                City:{" "}
                <Text style={styles.value}>{donor.home_address?.city}</Text>
              </Text>
              <Text style={styles.label}>
                Age:{" "}
                <Text style={styles.value}>
                  {donor.age?.value} {donor.age?.unit}
                </Text>
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Donor Details</Text>
            {selectedDonor && (
              <>
                <Text>
                  Name: {selectedDonor.user?.name?.first}{" "}
                  {selectedDonor.user?.name?.middle}{" "}
                  {selectedDonor.user?.name?.last}
                </Text>
                <Text>Phone: {selectedDonor.user?.phone}</Text>
                <Text>
                  Address: {selectedDonor.home_address?.street},{" "}
                  {selectedDonor.home_address?.brgy},{" "}
                  {selectedDonor.home_address?.city}
                </Text>
                <Text>
                  Age: {selectedDonor.age?.value} {selectedDonor.age?.unit}
                </Text>
                <Text>Birthday: {formatDate(selectedDonor.birthday)}</Text>
                <Text>Type: {selectedDonor.donorType}</Text>
                <Text>Eligibility: {selectedDonor.eligibility}</Text>
                <Text>Occupation: {selectedDonor.occupation || "N/A"}</Text>
                <Text>
                  Office Address: {selectedDonor.office_address || "N/A"}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DonorRecordTable;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
  },
  value: {
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
