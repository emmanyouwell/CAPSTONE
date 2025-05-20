import { createSlice } from '@reduxjs/toolkit';
import { addAnnouncements, deleteAnnouncement, getAnnouncement, getAnnouncementDetails, updateAnnouncements } from '../actions/announcementActions';


export const announcementSlice = createSlice({
    name: 'announcement',
    initialState: {
        announcements: [],
        loading: false,
        error: null,
        announcementDetails: {},
        isUpdated: false,
        isDeleted: false,
    },
    reducers: {
        resetUpdate: (state) => {
            state.isUpdated = false;
        },
        resetDelete: (state) => {
            state.isDeleted = false;
        },
        resetError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAnnouncement.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAnnouncement.fulfilled, (state, action) => {
                state.loading = false;
                state.announcements = action.payload.articles;
            })
            .addCase(getAnnouncement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAnnouncements.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addAnnouncements.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(addAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAnnouncements.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateAnnouncements.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success;
            })
            .addCase(updateAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAnnouncementDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAnnouncementDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.announcementDetails = action.payload.article;
            })
            .addCase(getAnnouncementDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAnnouncement.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteAnnouncement.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success;
            })
            .addCase(deleteAnnouncement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})
export const {resetUpdate, resetDelete, resetError} = announcementSlice.actions;
export default announcementSlice.reducer;