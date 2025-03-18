import React, { useState, useEffect, startTransition } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import MenuItem from './MenuItem'; // Import your MenuItem component
import { SuperAdminMenuGrid } from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../../utils/helper';

const superAdminItems = [
  { id: '1', title: 'Donor Records', route: 'superadmin_donor_record', image: require('../../assets/image/donor-records.png') },
  { id: '2', title: 'Recipient Records', route: 'superadmin_recipient_record', image: require('../../assets/image/recipient-records.png') },
  { id: '3', title: 'Schedules', route: 'superadmin_schedules', image: require('../../assets/image/calendar.png') },
  { id: '4', title: 'Inventory', route: 'superadmin_inventories', image: require('../../assets/image/inventory-and-metrics.png') },
  { id: '5', title: 'Account Management', route: 'superadmin_account_management', image: require('../../assets/image/account-management.png') },
  { id: '6', title: 'Announcement Creation', image: require('../../assets/image/announcement-creation.png') },
  { id: '7', title: 'Resources Management', route: 'superadmin_articles', image: require('../../assets/image/resources-management.png') },
  { id: '8', title: 'Metrics', route: 'superadmin_metrics', image: require('../../assets/image/metrics.png') },
];

const adminItems = [
  { id: '1', title: 'Donor Records', route: 'superadmin_donor_record', image: require('../../assets/image/donor-records.png') },
  { id: '2', title: 'Recipient Records', route: 'superadmin_recipient_record', image: require('../../assets/image/recipient-records.png') },
  { id: '3', title: 'Inventory', route: 'superadmin_inventories', image: require('../../assets/image/inventory-and-metrics.png') },
  { id: '4', title: 'Resources Management', route: 'superadmin_articles', image: require('../../assets/image/resources-management.png') },
  { id: '5', title: 'Schedules', route: 'superadmin_schedules', image: require('../../assets/image/calendar.png') },
  { id: '6', title: 'Announcement Creation', image: require('../../assets/image/announcement-creation.png') },
  { id: '7', title: 'Milk Requesting', route: 'MilkRequest', image: require('../../assets/image/resources-management.png') },
  { id: '8', title: 'Milk Letting', route: 'superadmin_milkLetting', image: require('../../assets/image/resources-management.png') },
];

const staffItems = [
  { id: '1', title: 'New Patient', route: 'AddPatient', image: require('../../assets/image/donor-records.png') },
  { id: '2', title: 'Add Request', route: 'AddRequest', image: require('../../assets/image/recipient-records.png') },
];

const MenuGrid = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    startTransition(() => {
      const fetchUserDetails = async () => {
        const user = await getUser();
        console.log("User", user)
        
        // Set the data based on user role
        if (user.role === 'SuperAdmin') {
          setData(superAdminItems);
        } else if (user.role === 'Admin') {
          setData(adminItems);
        } else if (user.role === 'Staff') {
          setData(staffItems);
        }
      };

      fetchUserDetails();
    });
  }, []);

  const renderItem = ({ item }) => (
    <MenuItem
      title={item.title}
      icon={<Image source={item.image} style={styles.icon} />}
      onPress={() => navigation.navigate(item.route)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Set the number of columns
        columnWrapperStyle={styles.row} // Optional: style for each row
      />
    </View>
  );
};

const styles = SuperAdminMenuGrid;

export default MenuGrid;
