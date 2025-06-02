import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { dataTableStyle } from "../../styles/Styles";

const RecipientRecordsTable = ({ recipients }) => {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (recipient) => {
    setSelectedRecipient(recipient);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipient(null);
  };

  const calculateTotalMilkRequested = (requested) => {
    return requested.reduce(
      (total, req) => total + (req?.reqId?.volume || 0),
      0
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardList}>
        {recipients.map((recipient, index) => (
          <TouchableOpacity
            key={recipient._id}
            onPress={() => openModal(recipient)}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.name}>{recipient.name}</Text>
                <Text style={styles.label}>
                  Address:{" "}
                  <Text style={styles.value}>
                    {recipient.home_address.street},{" "}
                    {recipient.home_address.brgy}, {recipient.home_address.city}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Phone: <Text style={styles.value}>{recipient.phone}</Text>
                </Text>
                <Text style={styles.label}>
                  Patient Type:{" "}
                  <Text style={styles.value}>{recipient.patientType}</Text>
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Modal for recipient details */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedRecipient && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedRecipient.name}
                  </Text>
                  <Text>Mother: {selectedRecipient.motherName}</Text>
                  <Text>Phone: {selectedRecipient.phone}</Text>
                  <Text>Patient Type: {selectedRecipient.patientType}</Text>
                  <Text>
                    Admission Date:{" "}
                    {new Date(
                      selectedRecipient.admissionDate
                    ).toLocaleDateString()}
                  </Text>
                  <Text>
                    Address: {selectedRecipient.home_address.street},{" "}
                    {selectedRecipient.home_address.brgy},{" "}
                    {selectedRecipient.home_address.city}
                  </Text>
                  <Text>
                    Total Milk Requested:{" "}
                    {calculateTotalMilkRequested(selectedRecipient.requested)}{" "}
                    ml
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
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 10,
    padding: 10,
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

export default RecipientRecordsTable;
