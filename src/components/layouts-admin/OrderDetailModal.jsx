import { Badge, Modal, Table } from "react-bootstrap";
import {
  BoxSeam,
  CalendarEvent,
  ClipboardCheck,
  PersonFill,
} from "react-bootstrap-icons";

const OrderDetailModal = ({ show, onHide, order }) => {
  if (!order) return null;
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN");

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
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <ClipboardCheck className="me-2 text-primary" />
          Chi tiết đơn hàng #{order.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>
            <CalendarEvent className="me-2 text-secondary" /> Thông tin đơn hàng
          </h5>
          <p>
            <strong>Ngày đặt:</strong> {formatDate(order.createdAt)}
          </p>
          <p>
            <strong>Trạng thái:</strong> {renderStatusBadge(order.status)}
          </p>
        </div>

        <div className="mb-4">
          <h5>
            {" "}
            <PersonFill className="me-2 text-secondary" /> Thông tin người nhận
          </h5>
          <p>
            <strong>Họ tên:</strong>{" "}
            {order.shippingInfo.fullName || "Không có tên"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.shippingInfo.phone || "—"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.shippingInfo.address || "—"}
          </p>
          {order.shippingInfo.note && (
            <p>
              <strong>Ghi chú:</strong> {order.shippingInfo.note}
            </p>
          )}
        </div>

        <h5 className="mt-3">
          <BoxSeam className="me-2 text-secondary" /> Sản phẩm trong đơn hàng
        </h5>
        <Table bordered hover size="sm" className="mt-2">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((p) => (
              <tr key={p.productId}>
                <td>
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.quantity}</td>
                <td>{formatCurrency(p.salePrice || p.price)}</td>
                <td>{formatCurrency((p.salePrice || p.price) * p.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="text-end mt-3">
          <h5>
            <strong>Tổng cộng:</strong>{" "}
            <span style={{ color: "red" }}>{formatCurrency(order.total)}</span>
          </h5>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailModal;
