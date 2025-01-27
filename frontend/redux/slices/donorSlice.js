import { createSlice } from '@reduxjs/toolkit';
import { getDonors, updateDonor } from '../actions/donorActions';
export const donorSlice = createSlice({
  name: 'donor',
  initialState: {
    donors: [],
    loading: false, 
    error: null, 
    pageSize: 0,
    totalDonors: 0,
    totalPages: 0,
    isUpdated: false
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getDonors.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDonors.fulfilled, (state, action) => {
        state.loading = false;
        state.donors = action.payload.donors;
        state.pageSize = action.payload.pageSize;
        state.totalDonors = action.payload.totalDonors;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(updateDonor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateDonor.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateDonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default donorSlice.reducer;
