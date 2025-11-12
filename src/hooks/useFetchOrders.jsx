import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading, setOrders } from "../redux/slices/orderSlice";

export const useFetchOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios.get("http://localhost:5000/orders");
        const sorted = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        dispatch(setOrders(sorted));
        dispatch(setLoading(false));
      } catch (err) {
        console.error("Error fetching orders:", err);
        dispatch(setLoading(false));
      }
    };

    if (orders.length === 0) {
      fetchOrders();
    }
  }, [dispatch, orders.length]);

  return { orders, loading };
};
