import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, getUserDetails } from '../../redux/actions/userActions'
import { Button, IconButton, Menu } from 'react-native-paper'
import { colors } from '../../styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons';
import { getBags } from '../../redux/actions/bagActions'
import { deleteBag } from '../../redux/actions/bagActions'
import { TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { requestSchedule } from '../../redux/actions/scheduleActions'
const Home = ({ navigation }) => {
  const [visible, setVisible] = useState({});
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const { bags, totalVolume, totalBags, oldestExpressDate, latestExpressDate } = useSelector((state) => state.bags);
  const openMenu = (id) => setVisible((prev) => ({ ...prev, [id]: true }));
  const closeMenu = (id) => setVisible((prev) => ({ ...prev, [id]: false }));

  const onMenuPress = () => {
    navigation.openDrawer();
  }
  const onLogoutPress = () => {
    dispatch(logoutUser()).then(() => { navigation.replace('login') }).catch((err) => console.log(err))
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
  useEffect(() => {
    if (oldestExpressDate && latestExpressDate) {
      console.log('oldestExpressDate: ', oldestExpressDate);
      console.log('latestExpressDate: ', latestExpressDate);
    }
  }, [oldestExpressDate, latestExpressDate])
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
        <View style={styles.card}>
          <Text style={styles.cardHeader}>{(oldestExpressDate && latestExpressDate) ? <>
            {new Date(oldestExpressDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}- {new Date(latestExpressDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</> : 'No dates'}</Text>
          <Icon name="time-outline" size={50} color="#fff" />
        </View>
        <View style={styles.list}>
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
                        <View style={styles.ellipsis}>
                          <Menu
                            visible={visible[item._id] || false}
                            onDismiss={() => closeMenu(item._id)}
                            anchor={
                              <IconButton
                                icon="dots-vertical"
                                size={24}
                                onPress={() => openMenu(item._id)}
                              />
                            }
                            anchorPosition='bottom'
                          >
                            <Menu.Item
                              onPress={() => {
                                closeMenu(item._id);
                                navigation.navigate('bagDetails', { id: item._id });
                              }}
                              title="Edit"
                            />
                            <Menu.Item
                              onPress={() => {
                                closeMenu(item._id);
                                handleDelete(item._id);
                              }}
                              title="Delete"
                            />
                          </Menu>
                        </View>
                        <View style={styles.itemContent}>
                          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={styles.itemSubText}>{item.volume}</Text>
                            <Text style={styles.itemText}>ml</Text>
                          </View>
                          <Text style={styles.itemText}>{new Date(item.expressDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // Ensures AM/PM format
                          })}</Text>


                        </View>
                      </View>
                    )}
                  />
                </View>
              </>
            ) : <View>
              <Text style={styles.defaultText}>No bags found</Text>
            </View>}

          <Button mode="contained" style={styles.btn} onPress={() => setOpen(true)}>
            <Text>Schedule for pick-up</Text>
          </Button>
          {/* Modal Date Picker */}
          <DatePicker
            modal
            open={open}
            date={new Date()}
            mode="datetime"
            onConfirm={(date) => {
              setOpen(false);
              const data = {
                date,
                userId: userDetails._id
              }
              dispatch(requestSchedule(data));
            }}
            onCancel={() => setOpen(false)}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  ellipsis: {
    width: '100%',
    alignItems: 'flex-end',
    position: 'relative',
    height: 'auto',
  },
  btn: {
    backgroundColor: colors.color1,
    padding: 4,
  },
  list: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20

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
    justifyContent: "space-center",
    borderRadius: 8,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 200,
    flex: 1
  },
  itemContent: {
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,

  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemSubText: {
    fontSize: 48,
    color: colors.color1,
  },
})

export default Home