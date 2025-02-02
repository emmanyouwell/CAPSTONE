import { createSlice } from '@reduxjs/toolkit';
import { addDevice, getDevices, sendNotification } from '../actions/notifActions';

export const notifSlice = createSlice({
  name: 'notifications',
  initialState: {
    devices: [],
    loading: false, 
    error: null,
    status: "not ok" 
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getDevices.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.userNotifs;
      })
      .addCase(getDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(addDevice.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendNotification.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.data.status;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default notifSlice.reducer;
