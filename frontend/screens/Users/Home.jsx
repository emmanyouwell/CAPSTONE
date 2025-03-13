import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, getUserDetails } from '../../redux/actions/userActions'
import { Button } from 'react-native-paper'
import { colors } from '../../styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons';
const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const onMenuPress = () => {
    navigation.openDrawer();
  }
  const onLogoutPress = () => {
    dispatch(logoutUser()).then(() => { navigation.navigate('login') }).catch((err) => console.log(err))
  }

  useEffect(() => {
    dispatch(getUserDetails())
  }, [dispatch])
  return (
    <>
      <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />

      <View style={styles.container}>

        <Text style={styles.headerText}>Welcome back, {userDetails && userDetails.name.first}</Text>
        <Button mode="contained" style={styles.btn} onPress={() => navigation.navigate('createBag')}>
          <Text>+ Add milk bag</Text>
        </Button>

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
  }
})

export default Home