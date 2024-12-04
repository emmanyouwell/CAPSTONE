import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // Example reducer
import userReducer from './slices/userSlice'; // User reducer
import donorReducer from './slices/donorSlice'; // Donor reducer
import recipientReducer from './slices/recipientSlice'
import eventReducer from './slices/eventSlice'
import inventoryReducer from './slices/inventorySlice'
import fridgeReducer from './slices/fridgeSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    donors: donorReducer,
    recipients: recipientReducer,
    events: eventReducer,
    inventories: inventoryReducer,
    fridges: fridgeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state check
    }),
});



