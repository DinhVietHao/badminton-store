import { useParams } from "react-router-dom";
import { Card, Row, Col, Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Error fetching order:", err));
  }, [id]);

  if (!order) {
    return <p className="text-center mt-5">Đang tải thông tin đơn hàng...</p>;
  }

  const { shippingInfo, products, total, status, createdAt } = order;

  const formatCurrency = (num) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        <i
          className="bi bi-receipt-cutoff me-2"
          style={{ color: "var(--color-one)" }}
        ></i>
        Chi tiết đơn hàng
      </h3>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header
              style={{ backgroundColor: "var(--color-one)", color: "#fff" }}
            >
              Thông tin giao hàng
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Họ tên:</strong> {shippingInfo.fullName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {shippingInfo.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {shippingInfo.address}
              </p>
              <p>
                <strong>Ghi chú:</strong> {shippingInfo.note || "Không có"}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header
              style={{ backgroundColor: "var(--color-two)", color: "#212529" }}
            >
              Thông tin đơn hàng
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Mã đơn hàng:</strong> {order.id}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <Badge
                  bg={
                    status === "pending"
                      ? "warning"
                      : status === "completed"
                      ? "success"
                      : "secondary"
                  }
                >
                  {status === "pending"
                    ? "Chờ xử lý"
                    : status === "completed"
                    ? "Hoàn thành"
                    : "Khác"}
                </Badge>
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                <span style={{ color: "var(--color-two)", fontWeight: "bold" }}>
                  {formatCurrency(total)}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header
          style={{ backgroundColor: "var(--color-one)", color: "#fff" }}
        >
          Sản phẩm trong đơn hàng
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      style={{ width: "70px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{p.title}</td>
                  <td>{formatCurrency(p.salePrice)}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <strong>{formatCurrency(p.salePrice * p.quantity)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
