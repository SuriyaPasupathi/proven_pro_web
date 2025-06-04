import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './Slice/authSlice';
import themeReducer from './Slice/themeSlice';
import registerReducer from './Slice/RegisterSlice';
import loginReducer from './Slice/LoginSlice';
import createProfileReducer from './Slice/CreateProfileSlice';
import dropDownReducer from './Slice/DropDownSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    register: registerReducer,
    login: loginReducer,
    createProfile: createProfileReducer,
    dropdown: dropDownReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
