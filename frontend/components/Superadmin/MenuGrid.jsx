// MenuGrid.js
import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import MenuItem from './MenuItem'; // Import your MenuItem component
import { SuperAdminMenuGrid } from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';
const menuItems = [
  { id: '1', title: 'Donor Records', route: 'superadmin_donor_record',image: require('../../assets/image/donor-records.png') },
  { id: '2', title: 'Recipient Records', route: 'superadmin_recipient_record', image: require('../../assets/image/recipient-records.png') },
  { id: '3', title: 'Schedules', route: 'superadmin_schedules', image: require('../../assets/image/calendar.png') },
  { id: '4', title: 'Inventory',image: require('../../assets/image/inventory-and-metrics.png') },
  { id: '5', title: 'Account Management', route: 'superadmin_account_management', image: require('../../assets/image/account-management.png') },
  { id: '6', title: 'Announcement Creation',image: require('../../assets/image/announcement-creation.png') },
  { id: '7', title: 'Resources Management',image: require('../../assets/image/resources-management.png') },
  { id: '8', title: 'Metrics', route: 'superadmin_metrics', image: require('../../assets/image/metrics.png') },
  
];


const MenuGrid = () => {
    const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <MenuItem title={item.title} icon={<Image source={item.image} style={styles.icon} />} onPress={() => navigation.navigate(item.route)} />
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
