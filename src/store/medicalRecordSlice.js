import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/api/apiService';

// Thunk action creator for fetching visualizations
export const fetchVisualizations = createAsyncThunk(
  'medicalRecord/fetchVisualizations',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.visualize(data);
      return response.visualizations;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch visualizations');
    }
  }
);

const initialState = {
  summary: null,
  consultation_id: null,
  metrics: null,
  visualizations: [],
  isLoading: false,
  error: null
};

export const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    setMedicalRecord: (state, action) => {
      return { ...state, ...action.payload };
    },
    setVisualizations: (state, action) => {
      state.visualizations = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearMedicalRecord: (state) => {
      return {
        consultation_id: null,
        summary: null,
        metrics: null,
        visualizations: [],
        isLoading: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisualizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVisualizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.visualizations = action.payload;
      })
      .addCase(fetchVisualizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setMedicalRecord, setVisualizations, setLoading, setError, clearMedicalRecord } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer; 