import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const loadState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  } catch (err) {
    return {
      token: null,
      user: null,
    };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; _id: string; name: string; email: string }>
    ) => {
      // Clear existing data first
      localStorage.clear();
      
      const { token, ...user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      // Clear all localStorage data
      localStorage.clear();
      // Reset API cache and state
      api.util.resetApiState();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;