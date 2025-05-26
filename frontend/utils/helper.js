import AsyncStorage from '@react-native-async-storage/async-storage';

// Authenticate and store the token and user in AsyncStorage
export const authenticate = async (data, next) => {
  try {
    
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
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
      return token ? token.replace(/"/g, '') : false;
    } catch (error) {
      console.error('Error retrieving token', error);
      return false;
    }
  };

// Get the user data from AsyncStorage
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Return `null` if no user is found
  } catch (error) {
    console.error('Error retrieving user data', error);
    return null; // Return `null` on error
  }
};

// Remove token and user from AsyncStorage (logout)
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing authentication data', error);
  }
  
};

export const viewAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
  
      console.log('AsyncStorage Contents:', items);
    } catch (error) {
      console.error('Error fetching AsyncStorage data:', error);
    }
  };

 export const formatDate = (dateString) => {
    try {
      const date = new Date(dateString); // Parse the date
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date'; // Fallback for invalid dates
    }
  };


  export const formatEventDetails = (date, time) => {
    const eventDateString = date.toISOString().split('T')[0]; // Get the date part (e.g., "2024-11-22")
    const eventTimeString = time.toTimeString().split(' ')[0];
    const eventDetails = `${eventDateString}T${eventTimeString}`;

    return eventDetails;
  }