import { Col, Container, Row } from "react-bootstrap";
import AdminSidebar from "../components/layouts-admin/AdminSidebar";
import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col
          md={2}
          className="bg-dark text-white p-0"
          style={{ minHeight: "100vh", position: "sticky", top: 0 }}
        >
          <AdminSidebar />
        </Col>

        <Col md={10} style={{ backgroundColor: "#f8f9fa" }}>
          <main className="p-4">
            <Outlet />
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
