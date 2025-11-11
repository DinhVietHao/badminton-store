import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setLoading,
  setProducts,
  setError,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../redux/slices/productSlice";

export const useFetchProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios.get("http://localhost:5000/products");
        dispatch(setProducts(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    if (products.length === 0) {
      fetchProducts();
    }
  }, [dispatch, products.length]);

  return { products, loading, error };
};
