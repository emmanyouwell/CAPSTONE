import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; 
import userReducer from './slices/userSlice'; 
import donorReducer from './slices/donorSlice'; 
import recipientReducer from './slices/recipientSlice'
import eventReducer from './slices/eventSlice'
import inventoryReducer from './slices/inventorySlice'
import fridgeReducer from './slices/fridgeSlice'
import requestReducer from './slices/requestSlice'
import equipmentReducer from './slices/equipmentSlice'
import articleReducer from './slices/articleSlice'
import notifReducer from './slices/notifSlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    donors: donorReducer,
    recipients: recipientReducer,
    events: eventReducer,
    inventories: inventoryReducer,
    fridges: fridgeReducer,
    requests: requestReducer,
    equipments: equipmentReducer,
    articles: articleReducer,
    devices: notifReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state check
    }),
});



