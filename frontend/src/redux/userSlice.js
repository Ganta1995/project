import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
  users: [],
  me: null,  
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (form, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/register", form);
      return res.data.user || form;
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.data ? err.response.data : "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (form, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/login", form);
            localStorage.setItem("token", res.data.token);
            return res.data.user || form;

        }catch (err) {
            return rejectWithValue(
                err.response && err.response.data ? err.response.data : "Login failed"

            )
        }
    }
);

export const fetchMe = createAsyncThunk(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/me", {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.data ? err.response.data : "Failed to fetch user info"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.data ? err.response.data : "Failed to fetch users"
      );
    }
  }
);

export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: token },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.data ? err.response.data : "Failed to delete user"
      );
    }
  }
);

export const updateUserById = createAsyncThunk(
  "user/updateUserById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/users/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.data ? err.response.data : "Failed to update user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
     })
     .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
     })
     .addCase(updateUserById.fulfilled, (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
       );
        } )
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;