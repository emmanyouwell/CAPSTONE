import { createSlice } from '@reduxjs/toolkit';
import { getDonors, getMilkPerMonth, updateDonor, getDonorsPerMonth, } from '../actions/donorActions';
import { createBag, deleteBag, getBags, getSingleBag, updateBag } from '../actions/bagActions';
export const bagSlice = createSlice({
    name: 'donor',
    initialState: {
        bags: [],
        loading: false,
        error: null,
        totalVolume: 0,
        totalBags: 0,
        totalPages: 0,
        oldestExpressDate: null,
        latestExpressDate: null,
        isUpdated: false,
        bagDetails: {}
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBag.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBag.fulfilled, (state, action) => {
                state.loading = false;
                state.bags = action.payload.bags
            })
            .addCase(createBag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBags.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBags.fulfilled, (state, action) => {
                state.loading = false;
                state.bags = action.payload.bags
                state.totalBags = action.payload.count
                state.totalVolume = action.payload.totalVolume
                state.oldestExpressDate = action.payload.oldestExpressDate
                state.latestExpressDate = action.payload.latestExpressDate
            })
            .addCase(getBags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleBag.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getSingleBag.fulfilled, (state, action) => {
                state.loading = false;
                state.bagDetails = action.payload.bag
                state.bags = []
            })
            .addCase(getSingleBag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBag.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateBag.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success
            })
            .addCase(updateBag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBag.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteBag.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success
            })
            .addCase(deleteBag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default bagSlice.reducer;
