import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Spinner,
  Alert,
  Breadcrumb,
} from "react-bootstrap";
import { ArrowLeft, PencilSquare } from "react-bootstrap-icons";
import { useFetchProductById } from "../../hooks/useFetchProductById"; // ← Import hook

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { product, loading, error } = useFetchProductById(id);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Lỗi: {error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/admin/products")}>
          ← Quay lại danh sách
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Không tìm thấy sản phẩm</Alert>
        <Button variant="secondary" onClick={() => navigate("/admin/products")}>
          ← Quay lại danh sách
        </Button>
      </Container>
    );
  }

  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString("vi-VN") + " ₫"
      : "0 ₫";

  const STATUS_MAP = {
    "IN-STOCK": { label: "Còn hàng", variant: "success" },
    "OUT-OF-STOCK": { label: "Hết hàng", variant: "danger" },
  };

  const statusInfo = STATUS_MAP[product.status] || {
    label: product.status,
    variant: "secondary",
  };

  return (
    <Container className="my-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/admin/products">
          Quản lý Sản phẩm
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Chi tiết sản phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Chi tiết Sản phẩm</h2>
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="me-2" />
            Quay lại
          </Button>
          <Button
            variant="warning"
            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
          >
            <PencilSquare className="me-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Row>
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Image
                src={product.thumbnailUrl || "/images/no-image.png"}
                alt={product.title}
                fluid
                className="mb-3"
                style={{
                  maxHeight: "400px",
                  objectFit: "contain",
                  width: "100%",
                }}
              />

              {product.gallery && product.gallery.length > 0 && (
                <div className="d-flex gap-2 flex-wrap">
                  {product.gallery.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      thumbnail
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3">{product.title}</h3>

              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: "30%" }}>SKU:</th>
                    <td>{product.sku}</td>
                  </tr>
                  <tr>
                    <th>Thương hiệu:</th>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <th>Trạng thái:</th>
                    <td>
                      <Badge bg={statusInfo.variant}>{statusInfo.label}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Số lượng:</th>
                    <td className="fw-bold">{product.quantity}</td>
                  </tr>
                  <tr>
                    <th>Đã bán:</th>
                    <td className="fw-bold">{product.soldCount || 0}</td>
                  </tr>
                  <tr>
                    <th>Giá gốc:</th>
                    <td>{fmt(product.originalPrice)}</td>
                  </tr>
                  <tr>
                    <th>Giá sale:</th>
                    <td className="text-danger fw-bold">
                      {fmt(product.salePrice)}
                    </td>
                  </tr>
                  <tr>
                    <th>Trình độ chơi:</th>
                    <td>{product.playerLevel}</td>
                  </tr>
                  <tr>
                    <th>Phong cách chơi:</th>
                    <td>{product.playingStyle}</td>
                  </tr>
                  <tr>
                    <th>Nội dung chơi:</th>
                    <td>{product.playType}</td>
                  </tr>
                  <tr>
                    <th>Độ cứng đũa:</th>
                    <td>{product.shaftFlexibility}</td>
                  </tr>
                  <tr>
                    <th>Điểm cân bằng:</th>
                    <td>{product.balancePoint}</td>
                  </tr>
                  <tr>
                    <th>Trọng lượng:</th>
                    <td>{product.weight}</td>
                  </tr>
                  <tr>
                    <th>Chiều dài:</th>
                    <td>{product.length}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Mô tả sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
