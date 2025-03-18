import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

// Create Milk Letting
export const createLetting = createAsyncThunk(
    'letting/createLetting',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/create-letting`, req, config)
            console.log("Create Letting: ", response.data)
            return response.data;

        } catch (error) {
            console.log("Error: ", error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Create Milk Letting
export const newPublicDonor = createAsyncThunk(
    'letting/newPublicDonor',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/letting-newDonor`, req, config)
            return response.data;

        } catch (error) {
            console.log("Error: ", error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Mark Attendance of donors
export const markAttendance = createAsyncThunk(
    'letting/markAttendance',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/mark-attendance`, req, config)
            console.log("Mark Attendance: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Mark Attendance of donors
export const finalizeSession = createAsyncThunk(
    'letting/finalizeSession',
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

            const response = await axios.post(`${REACT_APP_API_URL}/api/v1/finalize-session`, req, config)
            console.log("Finalize Session: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get all Milk Letting Event
export const getLettings = createAsyncThunk(
    'letting/getLettings',
    async (query, thunkAPI) => {

        const token = await getToken();

        if (!token) {
            console.log('No token available');
            throw new Error('No token available');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        console.log("Config: ", config)
        try {
            let urlString = ''
            if (query) {
                urlString = `${REACT_APP_API_URL}/api/v1/lettings?search=${query}`
            }
            else {
                urlString = `${REACT_APP_API_URL}/api/v1/lettings`
            }
            console.log("URL: ", urlString)
            const response = await axios.get(urlString, config);
            return response.data;

        } catch (error) {
            console.log("Error: ", error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Letting Details
export const getLettingDetails = createAsyncThunk(
    'letting/getLettingDetails',
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

            const response = await axios.get(`${REACT_APP_API_URL}/api/v1/letting/${id}`, config)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Delete Milk Letting
export const deleteLetting = createAsyncThunk(
    'letting/deleteLetting',
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
            const response = await axios.delete(`${REACT_APP_API_URL}/api/v1/letting/${id}`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Update Milk Letting
export const updateLetting = createAsyncThunk(
    'letting/updateLetting',
    async (req, thunkAPI) => {

        const token = await getToken();

        if (!token) {
            throw new Error('No token available');
        }
        console.log("Update Lettings: ", req)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        try {
            const response = await axios.put(`${REACT_APP_API_URL}/api/v1/letting/${req.id}`, req, config)
            
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
