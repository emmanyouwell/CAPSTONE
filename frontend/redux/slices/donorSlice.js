import { createSlice } from '@reduxjs/toolkit';
import { getDonors } from '../actions/donorActions';
export const donorSlice = createSlice({
  name: 'donor',
  initialState: {
    donors: [],
    loading: false, // Useful for async actions like login/signup
    error: null, // To handle errors
    count: 0,
    pageSize: 0,
    totalDonors: 0,
    totalPages: 0
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
        state.count = action.payload.count;
        state.pageSize = action.payload.pageSize;
        state.totalDonors = action.payload.totalDonors;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The error message passed in rejectWithValue
      })
      
  },
});

export default donorSlice.reducer;
