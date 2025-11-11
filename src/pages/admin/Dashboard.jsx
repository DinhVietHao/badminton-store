import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import {
  BoxSeam,
  PeopleFill,
  Receipt,
  ArrowUp,
  ArrowDown,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RevenueChart from "../../components/layouts-admin/RevenueChart";
import {
  selectAllProducts,
  selectProductsLoading,
} from "../../redux/slices/productSlice";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useFetchOrders } from "../../hooks/useFetchOrders";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import {
  calculateRevenueByDateRange,
  groupRevenueByMonth,
  countOrdersByStatus,
  getTopSellingProducts,
  calculateGrowthRate,
} from "../../utils/dashboardStats";

const Dashboard = () => {
  useFetchProducts();
  const products = useSelector(selectAllProducts);
  const productsLoading = useSelector(selectProductsLoading);

  const { orders, loading: ordersLoading } = useFetchOrders();
  const { users, loading: usersLoading } = useFetchUsers();

  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 6);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(new Date());

  const stats = useMemo(() => {
    if (orders.length === 0) return null;

    const revenue = calculateRevenueByDateRange(orders, startDate, endDate);
    const previousMonthStart = new Date(startDate);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousRevenue = calculateRevenueByDateRange(
      orders,
      previousMonthStart,
      startDate
    );
    const growthRate = calculateGrowthRate(revenue, previousRevenue);
    const orderStats = countOrdersByStatus(orders);
    const topProducts = getTopSellingProducts(orders, 5);
    const chartData = groupRevenueByMonth(orders, startDate, endDate);

    return {
      revenue,
      previousRevenue,
      growthRate,
      orderStats,
      topProducts,
      chartData,
    };
  }, [orders, startDate, endDate]);

  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString("vi-VN") + " ₫"
      : "0 ₫";

  const loading = productsLoading || ordersLoading || usersLoading;

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <BoxSeam size={40} className="text-primary" />
                </Col>
                <Col xs={9}>
                  <h6 className="text-muted mb-1">Tổng sản phẩm</h6>
                  <h3 className="fw-bold mb-0">
                    {loading ? "..." : products.length}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Receipt size={40} className="text-success" />
                </Col>
                <Col xs={9}>
                  <h6 className="text-muted mb-1">Tổng đơn hàng</h6>
                  <h3 className="fw-bold mb-0">
                    {loading ? "..." : orders.length}
                  </h3>
                  {stats && (
                    <small className="text-muted">
                      {stats.orderStats.pending} chờ xử lý
                    </small>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <PeopleFill size={40} className="text-info" />
                </Col>
                <Col xs={9}>
                  <h6 className="text-muted mb-1">Người dùng</h6>
                  <h3 className="fw-bold mb-0">
                    {loading ? "..." : users.length}
                  </h3>
                  <small className="text-muted">
                    {users.filter((u) => u.role === "customer").length} khách
                    hàng
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  {stats && stats.growthRate >= 0 ? (
                    <ArrowUp size={40} className="text-success" />
                  ) : (
                    <ArrowDown size={40} className="text-danger" />
                  )}
                </Col>
                <Col xs={9}>
                  <h6 className="text-muted mb-1">Doanh thu</h6>
                  <h3 className="fw-bold mb-0">
                    {loading ? "..." : fmt(stats?.revenue || 0)}
                  </h3>
                  {stats && (
                    <small
                      className={
                        stats.growthRate >= 0 ? "text-success" : "text-danger"
                      }
                    >
                      {stats.growthRate >= 0 ? "+" : ""}
                      {stats.growthRate.toFixed(1)}% so với kỳ trước
                    </small>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 pt-3 pb-0">
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="fw-bold mb-0">Phân tích Doanh thu</h5>
                </Col>
                <Col
                  md={6}
                  className="d-flex justify-content-end align-items-center"
                >
                  <Form.Label className="me-2 mb-0">Từ:</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    className="form-control form-control-sm"
                    wrapperClassName="me-3"
                  />
                  <Form.Label className="me-2 mb-0">Đến:</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    className="form-control form-control-sm"
                  />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {stats ? (
                <div style={{ height: "400px" }}>
                  <RevenueChart chartData={stats.chartData} />
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Đang tải dữ liệu...</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">Top 5 Sản phẩm bán chạy</h5>
            </Card.Header>
            <Card.Body>
              {stats && stats.topProducts.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên sản phẩm</th>
                      <th className="text-center">Đã bán</th>
                      <th className="text-end">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, index) => (
                      <tr key={product.productId}>
                        <td>
                          <Badge bg={index === 0 ? "warning" : "secondary"}>
                            {index + 1}
                          </Badge>
                        </td>
                        <td>
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "300px" }}
                          >
                            {product.title}
                          </div>
                        </td>
                        <td className="text-center">
                          <Badge bg="info">{product.totalQuantity}</Badge>
                        </td>
                        <td className="text-end fw-bold">
                          {fmt(product.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Chưa có dữ liệu bán hàng</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ========== TRẠNG THÁI ĐƠN HÀNG ========== */}
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">Trạng thái đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              {stats ? (
                <div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Chờ xử lý</span>
                      <strong className="text-warning">
                        {stats.orderStats.pending}
                      </strong>
                    </div>
                    <ProgressBar
                      variant="warning"
                      now={
                        (stats.orderStats.pending / stats.orderStats.total) *
                        100
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Đang giao</span>
                      <strong className="text-info">
                        {stats.orderStats.shipping}
                      </strong>
                    </div>
                    <ProgressBar
                      variant="info"
                      now={
                        (stats.orderStats.shipping / stats.orderStats.total) *
                        100
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Hoàn thành</span>
                      <strong className="text-success">
                        {stats.orderStats.completed}
                      </strong>
                    </div>
                    <ProgressBar
                      variant="success"
                      now={
                        (stats.orderStats.completed / stats.orderStats.total) *
                        100
                      }
                    />
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h6 className="mb-0">Tổng cộng</h6>
                    <h5 className="mb-0 fw-bold">{stats.orderStats.total}</h5>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Chưa có đơn hàng</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
