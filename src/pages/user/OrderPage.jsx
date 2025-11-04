import { useEffect, useState } from "react";
import { Container, Card, Table, Badge, Spinner } from "react-bootstrap";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 2; // giả sử user đang đăng nhập có id = 2

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/orders");
        const data = await res.json();

        // Lọc đơn hàng của user hiện tại
        const userOrders = data.filter((order) => order.userId === userId);
        setOrders(userOrders);
      } catch (err) {
        console.error("Lỗi khi fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN");
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case "shipping":
        return <Badge bg="info">Đang giao</Badge>;
      case "done":
        return <Badge bg="success">Hoàn tất</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> <p>Đang tải dữ liệu...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4 fw-bold">Đơn hàng của tôi</h3>

      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Mã đơn: #{order.id}</strong>
                <div className="text-muted small">
                  Ngày đặt: {formatDate(order.createdAt)}
                </div>
              </div>
              <div>{renderStatusBadge(order.status)}</div>
            </Card.Header>

            <Card.Body>
              <Table bordered hover responsive size="sm">
                <thead>
                  <tr className="table-light">
                    <th>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tạm tính</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p) => (
                    <tr key={p.productId}>
                      <td style={{ width: "80px" }}>
                        <img
                          src={p.thumbnailUrl}
                          alt={p.title}
                          className="img-fluid rounded"
                        />
                      </td>
                      <td>{p.title}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price.toLocaleString("vi-VN")} ₫</td>
                      <td>
                        {(p.price * p.quantity).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end fw-bold">
                Tổng cộng: {order.total.toLocaleString("vi-VN")} ₫
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderPage;
