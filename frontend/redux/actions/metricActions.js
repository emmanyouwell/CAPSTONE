import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

export const getMilkPerMonth = createAsyncThunk(
    'milkPerMonth/getMilkPerMonth',
    async (thunkAPI) => {

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
            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/milkPerMonth`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getDonorsPerMonth = createAsyncThunk(
    'donorsPerMonth/getDonorsPerMonth',
    async (thunkAPI) => {

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
            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/donorsPerMonth`, config)
            
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getDispensedMilkPerMonth = createAsyncThunk(
    'donorsPerMonth/getDispensedMilkPerMonth',
    async (thunkAPI) => {

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
            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/dispensePerMonth`, config)
            
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)