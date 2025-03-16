import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

// Request Milk schedule
export const requestSchedule = createAsyncThunk(
    'schedule/requestSchedule',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/request-schedule`, req, config)
            console.log("request schedule: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Mark Attendance of donors
export const approveSchedule = createAsyncThunk(
    'schedule/approveSchedule',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/approve-schedule`, req, config)
            console.log("approve schedule: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)


export const getDonorSchedules = createAsyncThunk(
    'schedule/getDonorSchedules',
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

            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/me/schedules/${req}`, config)
            console.log("get donor schedules: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)