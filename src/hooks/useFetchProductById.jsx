import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setLoading,
  setCurrentProduct,
  setError,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError,
} from "../redux/slices/productSlice";

export const useFetchProductById = (productId) => {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios.get(
          `http://localhost:5000/products/${productId}`
        );
        dispatch(setCurrentProduct(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [dispatch, productId]);

  return { product, loading, error };
};
