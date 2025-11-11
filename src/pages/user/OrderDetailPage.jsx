import { Card, Row, Col, Container, Spinner, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../service/orderApi";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router";
import {
  setCurrentOrder,
  setLoadingDetail,
} from "../../redux/slices/orderSlice";
import { APP_CONFIG } from "../../config";
const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loadingDetail } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    const fetchOrderDetail = async () => {
      dispatch(setLoadingDetail(true));
      try {
        const data = await getOrderById(id);
        dispatch(setCurrentOrder(data));
        dispatch(setLoadingDetail(false));
      } catch (err) {
        toast.error("Lỗi load xem chi tiết đơn hàng!");
        console.error("Lỗi khi fetch orders:", err);
        dispatch(setLoadingDetail(false));
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id, dispatch]);

  if (loadingDetail) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Đang tải thông tin đơn hàng...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Không tìm thấy đơn hàng
        </div>
      </Container>
    );
  }

  const { shippingInfo, products, total } = order;

  const formatCurrency = (num) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = products.reduce(
    (sum, p) => sum + p.salePrice * p.quantity,
    0
  );
  const shippingFee = APP_CONFIG.SHIPPING_FEE;
  return (
    <Container className="py-4 order-detail-container">
      <Row className="align-items-center mb-4">
        <Col>
          <h4 className="fw-bold mb-0">
            Mã đơn hàng:{" "}
            <span className="text-success">#{id.toUpperCase()}</span>
          </h4>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-success"
            className="rounded-pill px-4"
            as={Link}
            to="/orders"
          >
            <i className="bi bi-arrow-left me-2"></i>Trở lại
          </Button>
        </Col>
      </Row>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-light fw-semibold">
          <i className="bi bi-person-circle me-2 text-success"></i>
          Thông tin người nhận
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <p className="mb-1">
                <strong>Họ và tên:</strong> {shippingInfo.fullName}
              </p>
            </Col>
            <Col md={4}>
              <p className="mb-1">
                <strong>Số điện thoại:</strong> {shippingInfo.phone}
              </p>
            </Col>
            <Col md={4}>
              <p className="mb-1">
                <strong>Địa chỉ:</strong> {shippingInfo.address}
              </p>
            </Col>
            {shippingInfo.note && (
              <Col md={12} className="mt-2">
                <p className="mb-0">
                  <strong>Ghi chú:</strong> {shippingInfo.note}
                </p>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light fw-semibold">
          <i className="bi bi-bag-check me-2 text-success"></i>
          Sản phẩm & Thanh toán
        </Card.Header>
        <Card.Body className="p-0">
          {products.map((p, index) => (
            <div
              key={index}
              className={`p-4 d-flex justify-content-between align-items-center ${
                index !== products.length - 1 ? "border-bottom" : ""
              }`}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
                <div>
                  <h6 className="fw-semibold mb-2">{p.title}</h6>
                  <small className="text-muted">x{p.quantity}</small>
                </div>
              </div>

              <div className="text-end" style={{ minWidth: "200px" }}>
                {p.originalPrice > p.salePrice ? (
                  <>
                    <div className="text-muted text-decoration-line-through">
                      {formatCurrency(p.originalPrice)}
                    </div>
                    <div>{formatCurrency(p.salePrice)}</div>
                  </>
                ) : (
                  <div>{formatCurrency(p.salePrice)}</div>
                )}
              </div>
            </div>
          ))}
          <div className="p-4 border-top">
            <Row className="justify-content-end">
              <Col md={6} lg={4}>
                <Row className="mb-2">
                  <Col>Tổng tiền hàng</Col>
                  <Col className="text-end">{formatCurrency(subtotal)}</Col>
                </Row>
                <Row className="mb-2">
                  <Col>Phí vận chuyển</Col>
                  <Col className="text-end">{formatCurrency(shippingFee)}</Col>
                </Row>
                <hr />
                <Row className="fw-bold text-danger fs-5">
                  <Col>Thành tiền</Col>
                  <Col className="text-end">{formatCurrency(total)}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetailPage;
