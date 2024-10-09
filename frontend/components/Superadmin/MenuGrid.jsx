// MenuGrid.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MenuItem from './MenuItem'; // Import your MenuItem component
import { SuperAdminMenuGrid } from '../../styles/Styles';

const menuItems = [
  { id: '1', title: 'Donor Records' },
  { id: '2', title: 'Recipient Records' },
  { id: '3', title: 'Schedules' },
  { id: '4', title: 'Inventory & Metrics' },
  { id: '5', title: 'Account Management' },
  { id: '6', title: 'Announcement Creation' },
  { id: '7', title: 'Resources Management' },
  { id: '8', title: 'Revenue' },
];

const MenuGrid = () => {
  const renderItem = ({ item }) => (
    <MenuItem title={item.title} onPress={() => console.log(item.title)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Set the number of columns
        columnWrapperStyle={styles.row} // Optional: style for each row
      />
    </View>
  );
};

const styles = SuperAdminMenuGrid

export default MenuGrid;
