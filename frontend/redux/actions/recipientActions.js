import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authenticate, getToken, logout } from '../../utils/helper';
import { REACT_APP_API_URL } from '@env';

// Get All Patient
export const getRecipients = createAsyncThunk(
    'recipient/getRecipients',
    async ({search="", page=1, pageSize=10}, thunkAPI) => {
        
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
            let urlString = `http://192.168.1.24:4000/api/v1/patients?page=${page}&pageSize=${pageSize}`;
            if (search) {
                urlString += `&search=${encodeURIComponent(search)}`;
            }
           
            const response = await axios.get(urlString, config);

            console.log("Response", response.data)
            console.log("URL: ", urlString)

            return response.data;

        } catch (error) {
            
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Add Patient 
export const addPatient = createAsyncThunk(
    'Patient/addPatients',
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

            const response = await axios.post(`http://192.168.1.24:4000/api/v1/patients`, req, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Update Patient
export const updatePatient = createAsyncThunk(
    'Patient/updatePatient',
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
            const response = await axios.put(`http://192.168.1.24:4000/api/v1/patient/${req.id}`, req, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Delete Patient
export const deletePatient = createAsyncThunk(
    'Patient/deletePatients',
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
            const response = await axios.delete(`http://192.168.1.24:4000/api/v1/patient/${id}`, config)

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Get Patient Details
export const getPatientDetails = createAsyncThunk(
    'Patient/getPatientDetails',
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

            const response = await axios.get(`http://192.168.1.24:4000/api/v1/patient/${id}`, config)
            console.log("Response: ", response.data)
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
