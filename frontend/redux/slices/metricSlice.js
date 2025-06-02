import { createSlice } from "@reduxjs/toolkit";
import {
  getMilkPerMonth,
  getDonorsPerMonth,
  getDispensedMilkPerMonth,
  getPatientsPerMonth,
  getRequestsPerMonth,
  getAvailableMilk,
  getExpiringMilk,
  donationLocation,
  donorLocation,
  patientHospital,
} from "../actions/metricActions";
export const metricSlice = createSlice({
  name: "metric",
  initialState: {
    loading: false,
    error: null,
    stats: null,
    monthlyDonors: null,
    dispensedMilk: null,
    monthlyPatients: null,
    monthlyRequests: null,
    availableMilk: null,
    expiringMilk: null,
    donationsPerBrgy: null,
    donorsPerBrgy: null,
    patientPerHospital: null,
  },
  reducers: {},
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
      })

      .addCase(getPatientsPerMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPatientsPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyPatients = action.payload.recipients;
      })
      .addCase(getPatientsPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRequestsPerMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRequestsPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRequests = action.payload.requests;
      })
      .addCase(getRequestsPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getAvailableMilk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAvailableMilk.fulfilled, (state, action) => {
        state.loading = false;
        state.availableMilk = action.payload.availableMilk;
      })
      .addCase(getAvailableMilk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getExpiringMilk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getExpiringMilk.fulfilled, (state, action) => {
        state.loading = false;
        state.expiringMilk = action.payload.expiringMilk;
      })
      .addCase(getExpiringMilk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(donationLocation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(donationLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.donationsPerBrgy = action.payload.volumePerLocation;
      })
      .addCase(donationLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(donorLocation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(donorLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.donorsPerBrgy = action.payload.donors;
      })
      .addCase(donorLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(patientHospital.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(patientHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.patientPerHospital = action.payload.hospitals;
      })
      .addCase(patientHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default metricSlice.reducer;
