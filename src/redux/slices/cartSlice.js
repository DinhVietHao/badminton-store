import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  total: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
      );
    },

    updateItemQuantity: (state, action) => {
      const { id, newQuantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = newQuantity;
        state.total = state.items.reduce(
          (sum, item) => sum + item.salePrice * item.quantity,
          0
        );
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});
export const {
  setLoading,
  setCartItems,
  updateItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
