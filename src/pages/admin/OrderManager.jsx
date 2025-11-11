import { useEffect, useState } from "react";
import {
  Table,
  Badge,
  Button,
  Breadcrumb,
  Container,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { CheckCircle, Eye } from "react-bootstrap-icons";
import { getOrders, updateOrderStatus } from "../../service/orderApi";
import OrderDetailModal from "../../components/layouts-admin/OrderDetailModal";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const itemsPerPage = 2;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Lỗi khi fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleUpdateStatus = async (id) => {
    try {
      const updated = await updateOrderStatus(id, "confirm");

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      console.error("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case "confirm":
        return <Badge bg="success">Đã xác nhận</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN");

  // Hàm format tiền
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> <p>Đang tải dữ liệu...</p>
      </Container>
    );
  }
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
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.shippingInfo?.fullName}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatCurrency(order.total)}</td>
              <td>{renderStatusBadge(order.status)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetails(order)}
                >
                  <Eye className="me-1" /> Xem
                </Button>
                {order.status === "pending" && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id)}
                  >
                    <CheckCircle className="me-1" /> Xác nhận
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      )}

      <OrderDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderManager;
