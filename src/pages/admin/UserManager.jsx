import React from "react";
import { Table, Badge, Breadcrumb, Image } from "react-bootstrap";

const fakeUsers = [
  {
    id: 1,
    fullName: "Shop Admin",
    email: "admin@badmintonshop.com",
    role: "admin",
    avatarUrl: "https://placehold.co/50x50/17202A/EBF5FB?text=A",
  },
  {
    id: 2,
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    role: "customer",
    avatarUrl: "https://placehold.co/50x50/17202A/EBF5FB?text=N",
  },
];

const UserManager = () => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Quản lý Tài khoản</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Quản lý Tài khoản</h1>

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {fakeUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  roundedCircle
                  style={{ width: "40px", height: "40px" }}
                />
              </td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "admin" ? "primary" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserManager;
