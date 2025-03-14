import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, getUserDetails } from '../../redux/actions/userActions'
import { Button } from 'react-native-paper'
import { colors } from '../../styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons';
import { getBags } from '../../redux/actions/bagActions'
import { deleteBag } from '../../redux/actions/bagActions'
const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const { bags, totalVolume, totalBags } = useSelector((state) => state.bags);
  const onMenuPress = () => {
    navigation.openDrawer();
  }
  const onLogoutPress = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }
  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteBag(id)).then(() => { dispatch(getBags(userDetails._id)) }).catch((err) => console.log(err));
  }

  // 1️⃣ Fetch user details once when screen gains focus
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserDetails());
    }, [dispatch]) // Only depends on `dispatch`
  );

  // 2️⃣ Fetch bags when `userDetails` changes (but NOT inside useFocusEffect)
  useEffect(() => {
    if (userDetails) {
      dispatch(getBags(userDetails._id));
    }
  }, [userDetails, dispatch]); // Runs only when `userDetails` updates
  return (
    <>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <View style={styles.container}>

        <Text style={styles.headerText}>Welcome back, {userDetails && userDetails.name.first}</Text>
        <Button mode="contained" style={styles.btn} onPress={() => navigation.navigate('createBag')}>
          <Text>+ Add milk bag</Text>
        </Button>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Total Volume: {totalVolume} ml</Text>
          <Icon name="water-outline" size={50} color="#fff" />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Total Bags: {totalBags} pcs</Text>
          <Icon name="cube-outline" size={50} color="#fff" />
        </View>
        {bags && bags.length > 0 ?
          (
            <>
              <View style={{ flexGrow: 0 }}>
                <FlatList
                  data={bags} // List Data
                  keyExtractor={(item) => item._id} // Unique Key
                  contentContainerStyle={{ paddingBottom: 20 }}
                  horizontal={true}
                  renderItem={({ item }) => (
                    <View style={styles.item}>
                      <View>
                        <Text style={styles.itemText}>{new Date(item.expressDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true, // Ensures AM/PM format
                        })}</Text>

                        <Text style={styles.itemSubText}>Volume: {item.volume} ml</Text>
                      </View>
                      <View style={styles.actionBtns}>
                        <Button mode="contained" style={styles.btn} onPress={() => navigation.navigate('bagDetails', { id: item._id })}>Edit</Button>
                        <Button mode="contained" style={styles.btn} onPress={() => handleDelete(item._id)}>Delete</Button>
                      </View>
                    </View>
                  )}
                />
              </View>
            </>
          ) : <View>
            <Text style={styles.defaultText}>No bags found</Text>
          </View>}


      </View>
    </>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.color1,
    padding: 4,
  },
  container: {
    flex: 1,
    padding: 8,
    gap: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  defaultText: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff'
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.color1_light,
    padding: 15,
    borderRadius: 8,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 'auto',
  },
  actionBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  item: {
    backgroundColor: "#fff",
    justifyContent: "space-between",

    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 150,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemSubText: {
    fontSize: 18,
    color: colors.color1,
  },
})

export default Home