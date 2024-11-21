import { createSlice } from '@reduxjs/toolkit';
import { getDonors } from '../actions/donorActions';
export const donorSlice = createSlice({
  name: 'donor',
  initialState: {
    donors: [],
    loading: false, // Useful for async actions like login/signup
    error: null, // To handle errors
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
      })
      .addCase(getDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The error message passed in rejectWithValue
      })
      
  },
});

export default donorSlice.reducer;
