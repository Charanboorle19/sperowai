import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import medicalRecordReducer from './medicalRecordSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['medicalRecord'] // Only persist medicalRecord
};

const rootReducer = combineReducers({
  medicalRecord: medicalRecordReducer,
  // ... other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Needed for Redux Persist
    })
});

export const persistor = persistStore(store); 