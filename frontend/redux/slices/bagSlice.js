import { createSlice } from '@reduxjs/toolkit';
import { getDonors, getMilkPerMonth, updateDonor, getDonorsPerMonth, } from '../actions/donorActions';
import { createbag } from '../actions/bagActions';
export const bagSlice = createSlice({
    name: 'donor',
    initialState: {
        bags: [],
        loading: false,
        error: null,
        pageSize: 0,
        totalBags: 0,
        totalPages: 0,
        isUpdated: false,
        bagDetails: {}
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createbag.pending, (state) => {
                state.loading = true;
            })
            .addCase(createbag.fulfilled, (state, action) => {
                state.loading = false;
                state.bags = action.payload.bags
            })
            .addCase(createbag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default bagSlice.reducer;
