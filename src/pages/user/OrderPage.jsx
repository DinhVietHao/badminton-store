import { useEffect } from "react";
import { Container, Card, Badge, Spinner, Nav } from "react-bootstrap";
import "../../styles/OrderPage.css";
import { Link } from "react-router";
import { getOrdersByUserId } from "../../service/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setOrders } from "../../redux/slices/orderSlice";
import toast from "react-hot-toast";
const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getOrdersByUserId(userId);
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(setOrders(sorted));
        dispatch(setLoading(false));
      } catch (err) {
        toast.error("Lỗi load đơn hàng!");
        console.error("Lỗi khi fetch orders:", err);
        dispatch(setLoading(false));
      }
    };

    fetchOrders();
  }, [userId, dispatch]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN");
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

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> <p>Đang tải dữ liệu...</p>
      </Container>
    );
  }

  return (
    <Container className="order-container">
      <h3 className="order-title">
        <i className="bi bi-bag-check-fill me-2" /> Đơn hàng của tôi
      </h3>

      {orders.length === 0 ? (
        <div className="text-center">
          <img src="/images/empty-order.png" alt="" />
          <p className="text-muted">Chưa có đơn hàng</p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="order-card mb-4 shadow-sm">
            <Card.Header className="order-card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Mã đơn: #{order.id}</strong>
                <div className="text-muted small">
                  Ngày đặt: {formatDate(order.createdAt)}
                </div>
              </div>
              <div>{renderStatusBadge(order.status)}</div>
            </Card.Header>

            <Card.Body>
              {order.products.map((p) => (
                <Nav.Link
                  as={Link}
                  to={`/orders/${order.id}`}
                  key={p.productId}
                >
                  <div
                    key={p.productId}
                    className="order-item d-flex align-items-center"
                  >
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      className="order-item-img rounded"
                    />
                    <div className="order-item-info flex-grow-1">
                      <div className="fw-semibold">{p.title}</div>
                      <div className="text-muted small">
                        Số lượng: {p.quantity}
                      </div>
                    </div>
                    <div className="order-item-price text-end">
                      {p.originalPrice && p.originalPrice > p.salePrice ? (
                        <>
                          <div className="order-item-old-price">
                            {p.originalPrice.toLocaleString("vi-VN")} ₫
                          </div>
                          <div className="order-item-new-price">
                            {(p.salePrice * p.quantity).toLocaleString("vi-VN")}{" "}
                            ₫
                          </div>
                        </>
                      ) : (
                        <div className="order-item-new-price">
                          {(p.salePrice * p.quantity).toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                    </div>
                  </div>
                </Nav.Link>
              ))}
              <div className="text-end fw-bold order-total mt-3">
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
