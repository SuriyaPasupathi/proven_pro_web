import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setServices, setJobPositions, setSkills, setLoading, setError } from '../Slice/DropDownSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchServices = createAsyncThunk(
  'dropdown/fetchServices',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_URL}dropdown/?type=services`);
      dispatch(setServices(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch services'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchJobPositions = createAsyncThunk(
  'dropdown/fetchJobPositions',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_URL}dropdown/?type=jobpositions`);
      dispatch(setJobPositions(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch job positions'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchSkills = createAsyncThunk(
  'dropdown/fetchSkills',
  async (category: string | undefined, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const url = category 
        ? `${API_URL}dropdown/?type=skills&category=${encodeURIComponent(category)}`
        : `${API_URL}dropdown/?type=skills`;
      const response = await axios.get(url);
      thunkAPI.dispatch(setSkills(response.data));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch skills'));
      throw error;
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
