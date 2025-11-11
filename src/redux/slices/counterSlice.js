import { createSlice } from "@reduxjs/toolkit";

// ============ TẠO SLICE ============
const counterSlice = createSlice({
  name: "counter", // Tên của slice này

  // State ban đầu (giống useState)
  initialState: {
    value: 0, // Số đếm bắt đầu từ 0
  },

  // Các hành động (actions) có thể làm
  reducers: {
    // Hành động: Tăng số lên 1
    increment: (state) => {
      state.value = state.value + 1; // ← Redux Toolkit cho phép viết như này!
    },

    // Hành động: Giảm số xuống 1
    decrement: (state) => {
      state.value = state.value - 1;
    },

    // Hành động: Tăng theo số lượng tùy chỉnh
    incrementByAmount: (state, action) => {
      state.value = state.value + action.payload; // payload = số lượng truyền vào
    },
  },
});

// Export actions để component sử dụng
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export reducer để thêm vào store
export default counterSlice.reducer;
