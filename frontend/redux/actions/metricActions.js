import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../utils/helper";
import { REACT_APP_API_URL } from "@env";
import api from "../../api/axiosInstance";
export const getMilkPerMonth = createAsyncThunk(
  "metrics/getMilkPerMonth",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/milkPerMonth`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDonorsPerMonth = createAsyncThunk(
  "metrics/getDonorsPerMonth",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/donorsPerMonth`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDispensedMilkPerMonth = createAsyncThunk(
  "metrics/getDispensedMilkPerMonth",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/dispensePerMonth`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPatientsPerMonth = createAsyncThunk(
  "metrics/getPatientsPerMonth",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/patientsPerMonth`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getRequestsPerMonth = createAsyncThunk(
  "metrics/getRequestsPerMonth",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/requestsPerMonth`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAvailableMilk = createAsyncThunk(
  "metrics/getAvailableMilk",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/availableMilk`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getExpiringMilk = createAsyncThunk(
  "metrics/getExpiringMilk",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/expiringMilk`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const donationLocation = createAsyncThunk(
  "metrics/donationLocation",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/donationLocation`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const donorLocation = createAsyncThunk(
  "metrics/donorLocation",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/donorLocation`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const patientHospital = createAsyncThunk(
  "metrics/patientHospital",
  async (thunkAPI) => {
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      const response = await api.get(`/api/v1/patientHospital`, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
