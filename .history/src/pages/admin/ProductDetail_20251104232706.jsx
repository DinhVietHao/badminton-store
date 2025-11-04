import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { ProductContext } from "../../contexts/ProductContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { products, loading, error } = useContext(ProductContext);

  const product = products.find((c) => c.id)

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h4>Đang tải dữ liệu sản phẩm...</h4>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/admin/products")}
      >
        ← Quay lại danh sách
      </Button>

      <Card className="shadow-sm p-4">
        <Row>
          <Col md={4}>
            <Card className="p-2 mb-3">
              <Card.Img
                src={product.thumbnailUrl}
                alt={product.title}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  <strong>SKU:</strong> {product.sku}
                </Card.Text>
                <Card.Text>
                  <strong>Trạng thái:</strong>{" "}
                  {product.status === "IN-STOCK" ? (
                    <span className="text-success">Còn hàng</span>
                  ) : (
                    <span className="text-danger">Hết hàng</span>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <h4 className="mb-3">Thông tin chi tiết</h4>
            <Table bordered hover>
              <tbody>
                <tr>
                  <td><strong>Thương hiệu</strong></td>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <td><strong>Mô tả</strong></td>
                  <td>{product.description}</td>
                </tr>
                <tr>
                  <td><strong>Giá gốc</strong></td>
                  <td>{product.originalPrice.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <td><strong>Giá khuyến mãi</strong></td>
                  <td className="text-danger fw-bold">
                    {product.salePrice.toLocaleString()} đ
                  </td>
                </tr>
                <tr>
                  <td><strong>Số lượng</strong></td>
                  <td>{product.quantity}</td>
                </tr>
                <tr>
                  <td><strong>Đã bán</strong></td>
                  <td>{product.soldCount}</td>
                </tr>
                <tr>
                  <td><strong>Trình độ người chơi</strong></td>
                  <td>{product.playerLevel}</td>
                </tr>
                <tr>
                  <td><strong>Kiểu đánh</strong></td>
                  <td>{product.playType}</td>
                </tr>
                <tr>
                  <td><strong>Phong cách chơi</strong></td>
                  <td>{product.playingStyle}</td>
                </tr>
                <tr>
                  <td><strong>Độ dẻo thân vợt</strong></td>
                  <td>{product.shaftFlexibility}</td>
                </tr>
                <tr>
                  <td><strong>Điểm cân bằng</strong></td>
                  <td>{product.balancePoint}</td>
                </tr>
                <tr>
                  <td><strong>Trọng lượng</strong></td>
                  <td>{product.weight}</td>
                </tr>
                <tr>
                  <td><strong>Chiều dài</strong></td>
                  <td>{product.length}</td>
                </tr>
              </tbody>
            </Table>

            <h5 className="mt-4 mb-2">📸 Bộ sưu tập ảnh</h5>
            <Row>
              {product.gallery && product.gallery.length > 0 ? (
                product.gallery.map((img, index) => (
                  <Col key={index} md={4} className="mb-3">
                    <Card className="border-0 shadow-sm">
                      <Card.Img
                        src={img}
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <p>Không có ảnh bổ sung</p>
              )}
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetail;
