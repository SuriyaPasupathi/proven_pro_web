import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DropDownState {
  services: any[];
  jobPositions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DropDownState = {
  services: [],
  jobPositions: [],
  loading: false,
  error: null,
};

const dropDownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<any[]>) => {
      state.services = action.payload;
    },
    setJobPositions: (state, action: PayloadAction<any[]>) => {
      state.jobPositions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setServices,
  setJobPositions,
  setLoading,
  setError,
} = dropDownSlice.actions;

export default dropDownSlice.reducer;
