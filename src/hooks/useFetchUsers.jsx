import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setLoading,
  setUsers,
  setError,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
} from "../redux/slices/userSlice";

export const useFetchUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios.get("http://localhost:5000/users");
        dispatch(setUsers(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [dispatch, users.length]);

  return { users, loading, error };
};
