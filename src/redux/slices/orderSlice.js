import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOrders: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
    },

    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrderStatus,
  setError,
  clearError,
} = orderSlice.actions;

export const selectAllOrders = (state) => state.orders.items;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export const selectPendingOrders = (state) =>
  state.orders.items.filter((o) => o.status === "pending");

export const selectCompletedOrders = (state) =>
  state.orders.items.filter(
    (o) => o.status === "completed" || o.status === "done"
  );

export default orderSlice.reducer;
