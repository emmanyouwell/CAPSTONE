import { createSlice } from '@reduxjs/toolkit';
import { getMilkPerMonth, getDonorsPerMonth, getDispensedMilkPerMonth } from '../actions/metricActions';
export const metricSlice = createSlice({
  name: 'metric',
  initialState: {
    loading: false, 
    error: null, 
    stats: {},
    monthlyDonors: {},
    dispensedMilk: {},
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

      .addCase(getDispensedMilkPerMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDispensedMilkPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.dispensedMilk = action.payload.dispensedMilk;
      })
      .addCase(getDispensedMilkPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
      
  },
});

export default metricSlice.reducer;