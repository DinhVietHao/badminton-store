// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import {
//   setLoading,
//   setOrders,
//   setError,
//   selectAllOrders,
//   selectOrdersLoading,
//   selectOrdersError,
// } from "../redux/slices/orderSlice";

// export const useFetchOrders = () => {
//   const dispatch = useDispatch();
//   const orders = useSelector(selectAllOrders);
//   const loading = useSelector(selectOrdersLoading);
//   const error = useSelector(selectOrdersError);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await axios.get("http://localhost:5000/orders");
//         const sorted = response.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         dispatch(setOrders(sorted));
//       } catch (err) {
//         dispatch(setError(err.message));
//       }
//     };

//     if (orders.length === 0) {
//       fetchOrders();
//     }
//   }, [dispatch, orders.length]);

//   return { orders, loading, error };
// };
