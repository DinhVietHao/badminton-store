import React, { useContext, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Image,
  Breadcrumb,
  Badge,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { ProductContext } from "../../contexts/ProductContext";
import { PencilSquare, Trash, PlusCircle, Eye } from "react-bootstrap-icons";
import { Link } from "react-router";

const fmt = (value) =>
  typeof value === "number" && !Number.isNaN(value)
    ? value.toLocaleString("vi-VN") + " ₫"
    : "0 ₫";

const STATUS_MAP = {
  "IN-STOCK": "Còn hàng",
  "OUT-OF-STOCK": "Hết hàng",
};

const ProductManager = () => {
  const { products, loading, error } = useContext(ProductContext);

  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [salePriceError, setSalePriceError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  const handleAdd = () => {
    setCurrentProduct(null);
    setFormData({
      title: "",
      sku: "",
      description: "",
      brand: "",
      status: "IN-STOCK",
      quantity: 0,
      soldCount: 0,
      originalPrice: 0,
      salePrice: 0,
      playerLevel: "",
      playType: "",
      playingStyle: "",
      shaftFlexibility: "",
      balancePoint: "",
      weight: "",
      length: "",
      thumbnailUrl: "",
      gallery: ["", "", "", ""],
    });
    setValidated(false);
    setSalePriceError("");
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      ...product,
      gallery:
        product.gallery?.length >= 4
          ? product.gallery.slice(0, 4)
          : [...(product.gallery || []), "", "", "", ""].slice(0, 4),
    });
    setValidated(false);
    setSalePriceError("");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setValidated(false);
    setSalePriceError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "salePrice" || name === "originalPrice") {
      validateSalePrice(
        name === "salePrice" ? value : formData.salePrice,
        name === "originalPrice" ? value : formData.originalPrice
      );
    }
  };

  const validateSalePrice = (salePrice, originalPrice) => {
    if (salePrice && originalPrice) {
      const sale = parseFloat(salePrice);
      const original = parseFloat(originalPrice);

      if (sale < 0) {
        setSalePriceError("Giá khuyến mãi phải >= 0");
        return false;
      } else if (sale > original) {
        setSalePriceError("Giá khuyến mãi phải ≤ giá gốc");
        return false;
      } else {
        setSalePriceError("");
        return true;
      }
    }
    setSalePriceError("");
    return true;
  };

  const handleGalleryChange = (index, value) => {
    setFormData((prev) => {
      const newGallery = [...(prev.gallery || ["", "", "", ""])];
      newGallery[index] = value;
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    // Validate giá khuyến mãi
    const isSalePriceValid = validateSalePrice(
      formData.salePrice,
      formData.originalPrice
    );

    // Kiểm tra form validity và giá khuyến mãi
    if (form.checkValidity() === false || !isSalePriceValid) {
      setValidated(true);
      return;
    }

    setValidated(true);

    // Lọc bỏ ảnh phụ trống
    const cleanedGallery =
      formData.gallery?.filter((img) => img.trim() !== "") || [];

    const dataToSave = {
      ...formData,
      gallery: cleanedGallery,
      quantity: formData.quantity === "" ? 0 : parseInt(formData.quantity) || 0,
      soldCount: parseInt(formData.soldCount) || 0,
      originalPrice:
        formData.originalPrice === ""
          ? 0
          : parseFloat(formData.originalPrice) || 0,
      salePrice:
        formData.salePrice === "" ? 0 : parseFloat(formData.salePrice) || 0,
      createdAt: currentProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Nếu là thêm mới, tạo ID tăng dần
    if (!currentProduct) {
      try {
        const response = await fetch("http://localhost:5000/products");
        const allProducts = await response.json();

        const maxId = allProducts.reduce((max, product) => {
          const currentId = parseInt(product.id);
          return currentId > max ? currentId : max;
        }, 0);

        dataToSave.id = String(maxId + 1);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        alert("Không thể tạo ID sản phẩm mới");
        return;
      }
    }

    const url = currentProduct
      ? `http://localhost:5000/products/${currentProduct.id}`
      : `http://localhost:5000/products`;

    const method = currentProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      alert("Đã lưu thành công!");
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lưu");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const res = await fetch(`http://localhost:5000/products/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Xóa thất bại");
        alert("Đã xóa thành công!");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi xóa");
      }
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error)
    return <Alert variant="danger">Lỗi: {error.message || error}</Alert>;

  const pageCount = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Quản lý Sản phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Quản lý Sản phẩm ({products.length})</h1>
        <Button variant="primary" onClick={handleAdd}>
          <PlusCircle className="me-2" /> Thêm sản phẩm
        </Button>
      </div>

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Giá gốc</th>
            <th>Giá sale</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  rounded
                />
              </td>
              <td style={{ minWidth: "200px" }}>{product.title}</td>
              <td>{product.brand}</td>
              <td>{fmt(product.originalPrice)}</td>
              <td>{fmt(product.salePrice)}</td>
              <td>
                <Badge
                  bg={product.status === "IN-STOCK" ? "success" : "danger"}
                >
                  {STATUS_MAP[product.status] || product.status}
                </Badge>
              </td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/products/${product.id}`}
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                >
                  <Eye />
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(product)}
                >
                  <PencilSquare />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: pageCount }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageCount}
          />
        </Pagination>
      </div>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        scrollable
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Modal.Body
            style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
          >
            {/* THÔNG TIN CƠ BẢN */}
            <h5 className="mb-3 text-primary">Thông tin cơ bản</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>
                    Tên sản phẩm <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="VD: Vợt Cầu Lông Yonex Astrox 100ZZ"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập tên sản phẩm
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSku">
                  <Form.Label>
                    SKU (Mã sản phẩm) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku || ""}
                    onChange={handleChange}
                    placeholder="VD: YX-AX100ZZ-KR"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập mã SKU
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>
                Mô tả sản phẩm <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về sản phẩm..."
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập mô tả sản phẩm
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBrand">
                  <Form.Label>
                    Thương hiệu <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="brand"
                    value={formData.brand || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    <option value="Yonex">Yonex</option>
                    <option value="Lining">Lining</option>
                    <option value="Victor">Victor</option>
                    <option value="VNB">VNB</option>
                    <option value="Mizuno">Mizuno</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn thương hiệu
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formQuantity">
                  <Form.Label>
                    Số lượng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    placeholder="Nhập số lượng sản phẩm"
                    min="0" 
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập số lượng hợp lệ
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* GIÁ CẢ */}
            <h5 className="mb-3 text-primary mt-4">Giá cả</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formOriginalPrice">
                  <Form.Label>
                    Giá gốc (₫) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || ""} // Thêm || "" để tránh undefined
                    onChange={handleChange}
                    placeholder="Nhập giá gốc"
                    step="1000"
                    min="0" // Đổi từ min="1" thành min="0"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập giá gốc (phải lớn hơn 0)
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSalePrice">
                  <Form.Label>Giá khuyến mãi (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salePrice"
                    value={formData.salePrice || ""} // Thêm || "" để tránh undefined
                    onChange={handleChange}
                    placeholder="Nhập giá khuyến mãi"
                    step="1000"
                    min="0" // Đổi từ min="1" thành min="0"
                    required
                    isInvalid={!!salePriceError}
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập giá khuyến mãi (có thể bằng giá gốc)
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* THÔNG SỐ KỸ THUẬT */}
            <h5 className="mb-3 text-primary mt-4">Thông số kỹ thuật</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPlayerLevel">
                  <Form.Label>
                    Trình độ người chơi <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playerLevel"
                    value={formData.playerLevel || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn trình độ --</option>
                    <option value="Người mới bắt đầu">Người mới bắt đầu</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn trình độ người chơi
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPlayType">
                  <Form.Label>
                    Kiểu đánh <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playType"
                    value={formData.playType || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn kiểu đánh --</option>
                    <option value="Đánh đơn">Đánh đơn</option>
                    <option value="Đánh đôi">Đánh đôi</option>
                    <option value="Đánh đơn và đôi">Đánh đơn và đôi</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn kiểu đánh
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPlayingStyle">
                  <Form.Label>
                    Phong cách chơi <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playingStyle"
                    value={formData.playingStyle || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn phong cách --</option>
                    <option value="Tấn công">Tấn công</option>
                    <option value="Phòng thủ">Phòng thủ</option>
                    <option value="Toàn diện">Toàn diện</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn phong cách chơi
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formShaftFlexibility">
                  <Form.Label>
                    Độ dẻo thân vợt <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="shaftFlexibility"
                    value={formData.shaftFlexibility || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn độ dẻo --</option>
                    <option value="Dẻo">Dẻo</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Cứng">Cứng</option>
                    <option value="Siêu cứng">Siêu cứng</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn độ dẻo thân vợt
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formBalancePoint">
                  <Form.Label>
                    Điểm cân bằng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="balancePoint"
                    value={formData.balancePoint || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn điểm cân bằng --</option>
                    <option value="Nhẹ đầu">Nhẹ đầu</option>
                    <option value="Cân bằng">Cân bằng</option>
                    <option value="Nặng đầu">Nặng đầu</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn điểm cân bằng
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formWeight">
                  <Form.Label>
                    Trọng lượng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn trọng lượng --</option>
                    <option value="3U">3U (85-89g)</option>
                    <option value="4U">4U (80-84g)</option>
                    <option value="5U">5U (75-79g)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn trọng lượng
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formLength">
                  <Form.Label>
                    Chiều dài <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="length"
                    value={formData.length || ""}
                    onChange={handleChange}
                    placeholder="VD: 675mm"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập chiều dài
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* HÌNH ẢNH */}
            <h5 className="mb-3 text-primary mt-4">Hình ảnh sản phẩm</h5>

            <Form.Group className="mb-4" controlId="formThumbnailUrl">
              <Form.Label className="fw-bold">
                Ảnh đại diện (Thumbnail) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl || ""}
                onChange={handleChange}
                placeholder="/images/products/your-image.webp"
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập đường dẫn ảnh đại diện
              </Form.Control.Feedback>
              {formData.thumbnailUrl && (
                <div className="mt-2">
                  <Image
                    src={formData.thumbnailUrl}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    rounded
                  />
                </div>
              )}
            </Form.Group>

            <Form.Label className="fw-bold">
              Thư viện ảnh phụ (Gallery) - Tối đa 4 ảnh
            </Form.Label>
            <Row>
              {[0, 1, 2, 3].map((index) => (
                <Col md={6} key={index}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ảnh phụ {index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.gallery?.[index] || ""}
                      onChange={(e) =>
                        handleGalleryChange(index, e.target.value)
                      }
                      placeholder={`/images/products/gallery-${index + 1}.webp`}
                    />
                    {formData.gallery?.[index] && (
                      <div className="mt-2">
                        <Image
                          src={formData.gallery[index]}
                          alt={`Gallery ${index + 1}`}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                          rounded
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              <PlusCircle className="me-2" />
              {currentProduct ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductManager;
