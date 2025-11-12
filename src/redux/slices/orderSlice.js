import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  loadingDetail: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setLoadingDetail: (state, action) => {
      state.loadingDetail = action.payload;
    },

    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) {
        order.status = status;
      }
    },
  },
});

export const {
  setLoading,
  setLoadingDetail,
  setOrders,
  setCurrentOrder,
  updateOrderStatus,
} = orderSlice.actions;
export default orderSlice.reducer;
