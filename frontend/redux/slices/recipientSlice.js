import { createSlice } from '@reduxjs/toolkit';
import { getRecipients } from '../actions/recipientActions';
export const recipientSlice = createSlice({
  name: 'recipient',
  initialState: {
    recipients: [],
    loading: false, // Useful for async actions like login/signup
    error: null, // To handle errors
    count: 0,
    pageSize: 0,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getRecipients.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.recipients = action.payload.patients;
        state.count = action.payload.count;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The error message passed in rejectWithValue
      })
      
  },
});

export default recipientSlice.reducer;
