import { createSlice } from '@reduxjs/toolkit';
import { 
    addEquipments,
    deleteEquipments,
    getEquipmentDetails,
    getEquipments,
    updateEquipment,
 } from '../actions/equipmentActions';

export const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    equipments: [],
    loading: false, 
    error: null, 
    equipmentDetails: {},
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getEquipments.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = action.payload.equipments;
      })
      .addCase(getEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(addEquipments.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(updateEquipment.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getEquipmentDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEquipmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.equipmentDetails = action.payload.equipment;
      })
      .addCase(getEquipmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })

      .addCase(deleteEquipments.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export default equipmentSlice.reducer;
