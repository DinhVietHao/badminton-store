import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { BoxSeam, PeopleFill, Receipt } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RevenueChart from "../../components/layouts-admin/RevenueChart";
import {
  selectAllProducts,
  selectProductsLoading,
} from "../../redux/slices/productSlice";
import { useFetchProducts } from "../../hooks/useFetchProducts";

const generateMockData = (start, end) => {
  const data = [];
  const labels = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    labels.push(
      currentDate.toLocaleString("vi-VN", { month: "long", year: "numeric" })
    );
    data.push(Math.floor(Math.random() * 40000000) + 10000000);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: data,
        backgroundColor: "rgba(13, 110, 253, 0.6)",
        borderColor: "rgba(13, 110, 253, 1)",
        borderWidth: 1,
      },
    ],
  };
};

const Dashboard = () => {
  useFetchProducts();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);

  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 6);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const mockData = generateMockData(startDate, endDate);
    setChartData(mockData);
  }, [startDate, endDate]);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <BoxSeam size={40} className="text-primary" />
                </Col>
                <Col xs={9}>
                  <h5 className="text-muted">Tổng sản phẩm</h5>
                  <h3 className="fw-bold">
                    {loading ? "..." : products.length}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Receipt size={40} className="text-success" />
                </Col>
                <Col xs={9}>
                  <h5 className="text-muted">Đơn hàng mới</h5>
                  <h3 className="fw-bold">0</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col
                  xs={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <PeopleFill size={40} className="text-info" />
                </Col>
                <Col xs={9}>
                  <h5 className="text-muted">Người dùng</h5>
                  <h3 className="fw-bold">0</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
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
              <div style={{ height: "400px" }}>
                <RevenueChart chartData={chartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
