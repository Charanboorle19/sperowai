import { configureStore } from '@reduxjs/toolkit';
import medicalRecordReducer from './medicalRecordSlice';

export const store = configureStore({
  reducer: {
    medicalRecord: medicalRecordReducer
  }
}); 