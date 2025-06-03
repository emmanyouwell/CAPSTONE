import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../../components/Superadmin/Header";
import RecipientRecordTable from "../../components/Superadmin/RecipientRecordTable";
import { SuperAdmin, donorRecordsStyle, colors } from "../../styles/Styles";
import recipientsImg from "../../assets/image/recipients.jpg";
import { getRecipients } from "../../redux/actions/recipientActions";
import { useDispatch, useSelector } from "react-redux";

const RecipientRecords = ({ navigation }) => {
  const dispatch = useDispatch();
  const { recipients, totalPatients, totalPages, pageSize, loading, error } =
    useSelector((state) => state.recipients);

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  // Using onChangeText to update the state when text changes
  const handleTextChange = (newText) => {
    setSearch(newText);
  };
  const handleSubmit = () => {
    setCurrentPage(1);
    dispatch(getRecipients({ search: search }));
  };
  useEffect(() => {
    console.log("Dispatching getDonors...");

    dispatch(
      getRecipients({
        search: search,
        page: currentPage + 1,
        pageSize: pageSize,
      })
    )
      .unwrap()
      .then((data) => console.log("Recipients fetched:", data))
      .catch((err) => console.error("Error fetching donors:", err));
  }, [dispatch, search, currentPage, pageSize]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getRecipients())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };
  console.log(recipients);
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={donorRecordsStyle.imageContainer}>
        <ImageBackground source={recipientsImg} style={donorRecordsStyle.image}>
          <View style={donorRecordsStyle.overlay} />
          <Text style={donorRecordsStyle.headerText}>Recipient Records</Text>
          <View style={donorRecordsStyle.searchContainer}>
            <TextInput
              style={donorRecordsStyle.searchInput}
              placeholder="Search Recipient Records"
              placeholderTextColor="#ccc"
              onChangeText={handleTextChange}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            <Icon
              name="search"
              size={20}
              color={colors.color1}
              style={donorRecordsStyle.searchIcon}
            />
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          recipients && (
            <RecipientRecordTable
              recipients={recipients}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
              totalPatients={totalPatients}
              pageSize={pageSize}
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default RecipientRecords;
