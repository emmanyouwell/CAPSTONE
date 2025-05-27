import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';
import api from '../../api/axiosInstance'
export const getDonors = createAsyncThunk(
    'donor/getDonors',
    async ({ search="", page = 1, pageSize = 10 }, thunkAPI) => {
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
            
        };

        try {
            let urlString = `/api/v1/donors?page=${page}&pageSize=${pageSize}`;
            if (search) {
                urlString += `&search=${encodeURIComponent(search)}`;
            }
            console.log("API: ", api);
            const response = await api.get(urlString, config);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Update donor
export const updateDonor = createAsyncThunk(
    'donor/updateDonor',
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
            
        }
        
        try {
            const response = await api.put(`/api/v1/donor/${req.id}`, req, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)