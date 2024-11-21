import AsyncStorage from '@react-native-async-storage/async-storage';

// Authenticate and store the token and user in AsyncStorage
export const authenticate = async (data, next) => {
  try {
    
    await AsyncStorage.setItem('token', JSON.stringify(data.token));
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    console.error('Error storing authentication data', error);
  }
  next();
};

// Get the token from AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token ? JSON.parse(token) : false;
  } catch (error) {
    console.error('Error retrieving token', error);
    return false;
  }
};

// Get the user data from AsyncStorage
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : false;
  } catch (error) {
    console.error('Error retrieving user data', error);
    return false;
  }
};

// Remove token and user from AsyncStorage (logout)
export const logout = async (next) => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing authentication data', error);
  }
  next();
};
