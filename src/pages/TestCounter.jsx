import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../redux/slices/counterSlice";
import { Button, Container } from "react-bootstrap";

const TestCounter = () => {
  // ============ ĐỌC DỮ LIỆU TỪ REDUX ============
  // useSelector: Như "móc" lấy dữ liệu từ Store
  const count = useSelector((state) => state.counter.value);

  // ============ THAY ĐỔI DỮ LIỆU REDUX ============
  // useDispatch: Như "remote control" để điều khiển Store
  const dispatch = useDispatch();

  return (
    <Container className="text-center mt-5">
      <h1>Redux Counter Demo</h1>

      {/* Hiển thị giá trị từ Redux */}
      <h2 className="my-4">Số đếm: {count}</h2>

      <div className="d-flex gap-3 justify-content-center">
        {/* Nút giảm */}
        <Button variant="danger" onClick={() => dispatch(decrement())}>
          - Giảm
        </Button>

        {/* Nút tăng */}
        <Button variant="success" onClick={() => dispatch(increment())}>
          + Tăng
        </Button>

        {/* Nút tăng 5 */}
        <Button
          variant="primary"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          +5
        </Button>
      </div>
    </Container>
  );
};

export default TestCounter;
