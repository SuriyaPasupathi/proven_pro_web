import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setServices, setJobPositions, setLoading, setError, setSkills } from '../Slice/DropDownSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

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
  async (category: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_URL}skills-dropdown/?type=skills&category=${category}%20skills`);
      dispatch(setSkills(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch skills'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);


