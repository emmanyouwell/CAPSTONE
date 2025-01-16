import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

// Get All Equipments
export const getEquipments = createAsyncThunk(
    'equipment/getEquipment',
    async (query, thunkAPI) => {
        
        const token = await getToken();

        if (!token) {
            throw new Error('No token available');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            let urlString = ''
            if (query){
                urlString = `${REACT_APP_API_URL}/api/v1/equipments?search=${query}`
            }
            else {
                urlString = `${REACT_APP_API_URL}/api/v1/equipments`
            }

            const response = await axios.get(urlString, config);

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Add Equipment 
export const addEquipments = createAsyncThunk(
    'equipment/addEquipments',
    async (req, thunkAPI) => {

        const token = await getToken();

        if (!token) {
            throw new Error('No token available');
        }
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/equipments`, req, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Update Equipment
export const updateEquipment = createAsyncThunk(
    'equipment/updateEquipment',
    async (req, thunkAPI) => {

        const token = await getToken();

        if (!token) {
            throw new Error('No token available');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            const response = await axios.put(`${REACT_APP_API_URL}/api/v1/equipment/${req.id}`, req, config)
            console.log(response)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Delete Equipment
export const deleteEquipments = createAsyncThunk(
    'equipment/deleteEquipments',
    async (id, thunkAPI) => {

        const token = await getToken();

        if (!token) {
            throw new Error('No token available');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            const response = await axios.delete(`${REACT_APP_API_URL}/api/v1/equipment/${id}`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Equipment Details
export const getEquipmentDetails = createAsyncThunk(
    'equipment/getEquipmentDetails',
    async (id, thunkAPI) => {

        const token = await getToken();
        
        if (!token) {
            throw new Error('No token available');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {

            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/equipment/${id}`, config)
            console.log("Response: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
