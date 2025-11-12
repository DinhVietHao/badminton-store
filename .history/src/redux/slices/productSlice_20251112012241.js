import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProducts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      state.loading = false;
    },

    addProduct: (state, action) => {
      state.items.unshift(action.payload);
    },

    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    },

    removeProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    updateProductStock: (state, action) => {
      const { productId, quantity, soldCount } = action.payload;
      const product = state.items.find((p) => p.id === productId);
      if (product) {
        product.quantity = quantity;
        product.soldCount = soldCount;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
});

export const {
  setLoading,
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  updateProductStock,
  setError,
  clearError,
  clearCurrentProduct,
} = productSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export const selectInStockProducts = (state) =>
  state.products.items.filter((p) => p.status === "IN-STOCK");

export const selectOutOfStockProducts = (state) =>
  state.products.items.filter((p) => p.status === "OUT-OF-STOCK");

export default productSlice.reducer;
