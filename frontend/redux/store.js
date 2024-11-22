import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // Example reducer
import userReducer from './slices/userSlice'; // User reducer
import donorReducer from './slices/donorSlice'; // Donor reducer
import recipientReducer from './slices/recipientSlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    donors: donorReducer,
    recipients: recipientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state check
    }),
});

export const server = "http://192.168.59.139:4000";
