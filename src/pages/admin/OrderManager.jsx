import React from "react";
import { Table, Badge, Button, Breadcrumb } from "react-bootstrap";
import { CheckCircle } from "react-bootstrap-icons";

const fakeOrders = [
  {
    id: 1001,
    customer: "Nguyễn Văn A",
    date: "2025-11-04",
    total: 1500000,
    status: "Pending",
  },
  {
    id: 1002,
    customer: "Trần Thị B",
    date: "2025-11-03",
    total: 4550000,
    status: "Confirmed",
  },
];

const OrderManager = () => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Quản lý Đơn hàng</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Quản lý Đơn hàng</h1>

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {fakeOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{fmt(order.total)}</td>
              <td>
                <Badge bg={order.status === "Pending" ? "warning" : "success"}>
                  {order.status}
                </Badge>
              </td>
              <td>
                {order.status === "Pending" && (
                  <Button variant="outline-success" size="sm">
                    <CheckCircle className="me-1" /> Xác nhận
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const fmt = (value) =>
  typeof value === "number" && !Number.isNaN(value)
    ? value.toLocaleString("vi-VN") + " ₫"
    : "0 ₫";

export default OrderManager;
