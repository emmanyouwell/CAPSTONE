import { createSlice } from '@reduxjs/toolkit';
import { recordPublicRecord } from '../actions/collectionActions';

export const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    message: '',
    loading: false,
    error: null, 
    success: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(recordPublicRecord.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(recordPublicRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(recordPublicRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approveSchedule.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(approveSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(approveSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default collectionSlice.reducer;