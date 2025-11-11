import React, { useState } from "react";
import {
  Table,
  Badge,
  Breadcrumb,
  Image,
  Spinner,
  Alert,
  Pagination,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useFetchUsers } from "../../hooks/useFetchUsers";

const UserManager = () => {
  const { users, loading, error } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  const getDefaultAvatar = (fullName, role) => {
    const firstLetter = fullName?.charAt(0)?.toUpperCase() || "U";
    const bgColor = role === "admin" ? "0d6efd" : "6c757d";
    return `https://placehold.co/50x50/${bgColor}/FFFFFF?text=${firstLetter}`;
  };

  const pageCount = Math.ceil(users.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && users.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Lỗi: {error}</Alert>;
  }

  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Quản lý Tài khoản</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Quản lý Tài khoản ({users.length})</h1>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted mb-2">Tổng người dùng</h6>
              <h3 className="fw-bold mb-0">{users.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted mb-2">Khách hàng</h6>
              <h3 className="fw-bold mb-0 text-secondary">{totalCustomers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted mb-2">Quản trị viên</h6>
              <h3 className="fw-bold mb-0 text-primary">{totalAdmins}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Không có người dùng nào
              </td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <Image
                    src={
                      user.avatarUrl ||
                      getDefaultAvatar(user.fullName, user.role)
                    }
                    alt={user.fullName}
                    roundedCircle
                    style={{ width: "40px", height: "40px" }}
                  />
                </td>
                <td>
                  <div className="fw-semibold">{user.fullName}</div>
                  <small className="text-muted">@{user.username}</small>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || <span className="text-muted">-</span>}</td>
                <td>
                  <Badge bg={user.role === "admin" ? "primary" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Customer"}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {pageCount > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: pageCount }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageCount}
            />
          </Pagination>
        </div>
      )}
    </>
  );
};

export default UserManager;
