import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
import api from '../../api/axiosInstance';
// Get All Fridge
export const getFridges = createAsyncThunk(
    'fridge/getFridge',
    async (query, thunkAPI) => {
        
        const token = await getToken();
        console.log('Token Retrieved:', token);

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
                urlString = `/api/v1/fridges?search=${query}`
            }
            else {
                urlString = `/api/v1/fridges`
            }

            const response = await api.get(urlString, config);
            console.log("Response", response.data)
            console.log("URL: ", urlString)

            return response.data;

        } catch (error) {
            console.log("Error: ", error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Add Fridge 
export const addFridges = createAsyncThunk(
    'fridge/addFridges',
    async (req, thunkAPI) => {

        const token = await getToken();
        console.log('Token Retrieved:', token);

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

            const response = await api.post(`/api/v1/fridges`, req, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Update Fridge
export const updateFridge = createAsyncThunk(
    'fridge/updateFridge',
    async (req, thunkAPI) => {

        const token = await getToken();
        console.log('Token Retrieved:', token);

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
            const response = await api.put(`/api/v1/fridge/${req.id}`, req, config)
            console.log(response)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Delete Fridge
export const deleteFridges = createAsyncThunk(
    'fridge/deleteFridges',
    async (id, thunkAPI) => {

        const token = await getToken();
        console.log('Token Retrieved:', token);

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
            const response = await api.delete(`/api/v1/fridge/${id}`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Fridge Details
export const getFridgeDetails = createAsyncThunk(
    'fridge/getFridgeDetails',
    async (id, thunkAPI) => {

        const token = await getToken();
        console.log('Token Retrieved:', token);

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

            const response = await api.get(`/api/v1/fridge/${id}`, config)
            console.log("Response: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
