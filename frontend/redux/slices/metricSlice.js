import { createSlice } from '@reduxjs/toolkit';
import { getMilkPerMonth, getDonorsPerMonth } from '../actions/metricActions';
export const metricSlice = createSlice({
  name: 'metric',
  initialState: {
    loading: false, 
    error: null, 
    stats: {},
    monthlyDonors: {},
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMilkPerMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMilkPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getMilkPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(getDonorsPerMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDonorsPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyDonors = action.payload.result;
      })
      .addCase(getDonorsPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      
  },
});

export default metricSlice.reducer;