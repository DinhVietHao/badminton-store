import { createSlice } from "@reduxjs/toolkit";

// 🧩 Lấy user từ localStorage (nếu có)
let userFromStorage = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) userFromStorage = JSON.parse(storedUser);
} catch (err) {
  console.error("Lỗi khi parse user từ localStorage:", err);
  localStorage.removeItem("user");
}

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🕒 Set trạng thái loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // 👤 Đăng nhập thành công
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // ⚠️ Ghi nhận lỗi
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 🧹 Xóa lỗi
    clearError: (state) => {
      state.error = null;
    },

    // 🚪 Đăng xuất
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("user");
    },

    // 🔄 Cập nhật lại user sau khi chỉnh sửa profile
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setLoading, setUser, setError, clearError, logout, updateUser } =
  authSlice.actions;

// 🧭 Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) =>
  state.auth.user && state.auth.user.role === "admin";

export default authSlice.reducer;
