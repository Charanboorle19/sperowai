import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summary: null,
  consultation_id: null,
  metrics: null,
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
        isLoading: false,
        error: null
      };
    }
  }
});

export const { setMedicalRecord, setLoading, setError, clearMedicalRecord } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer; 