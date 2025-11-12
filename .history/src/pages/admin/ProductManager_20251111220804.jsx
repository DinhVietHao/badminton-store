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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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
      quantity: "",
      soldCount: 0,
      originalPrice: "",
      salePrice: "",
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
    setErrors({});
    setTouched({});
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
    setErrors({});
    setTouched({});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setErrors({});
    setTouched({});
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "title":
        if (!value || value.trim() === "") {
          errorMsg = "Vui lòng nhập tên sản phẩm";
        }
        break;
      case "sku":
        if (!value || value.trim() === "") {
          errorMsg = "Vui lòng nhập mã SKU";
        }
        break;
      case "description":
        if (!value || value.trim() === "") {
          errorMsg = "Vui lòng nhập mô tả sản phẩm";
        }
        break;
      case "brand":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn thương hiệu";
        }
        break;
      case "quantity":
        if (value === "" || value === null || value === undefined) {
          errorMsg = "Vui lòng nhập số lượng";
        } else if (parseInt(value) < 0) {
          errorMsg = "Số lượng phải >= 0";
        }
        break;
      case "originalPrice":
        if (value === "" || value === null || value === undefined) {
          errorMsg = "Vui lòng nhập giá gốc";
        } else if (parseFloat(value) <= 0) {
          errorMsg = "Giá gốc phải > 0";
        }
        break;
      case "salePrice":
        if (value !== "" && value !== null && value !== undefined) {
          const salePrice = parseFloat(value);
          const originalPrice = parseFloat(formData.originalPrice);

          if (salePrice < 0) {
            errorMsg = "Giá khuyến mãi phải >= 0";
          } else if (originalPrice && salePrice > originalPrice) {
            errorMsg = "Giá khuyến mãi phải ≤ giá gốc";
          }
        }
        break;
      case "playerLevel":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn trình độ người chơi";
        }
        break;
      case "playType":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn kiểu đánh";
        }
        break;
      case "playingStyle":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn phong cách chơi";
        }
        break;
      case "shaftFlexibility":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn độ dẻo thân vợt";
        }
        break;
      case "balancePoint":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn điểm cân bằng";
        }
        break;
      case "weight":
        if (!value || value === "") {
          errorMsg = "Vui lòng chọn trọng lượng";
        }
        break;
      case "length":
        if (!value || value.trim() === "") {
          errorMsg = "Vui lòng nhập chiều dài";
        }
        break;
      case "thumbnailUrl":
        if (!value || value.trim() === "") {
          errorMsg = "Vui lòng nhập đường dẫn ảnh đại diện";
        }
        break;
      default:
        break;
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field khi thay đổi
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleGalleryChange = (index, value) => {
    setFormData((prev) => {
      const newGallery = [...(prev.gallery || ["", "", "", ""])];
      newGallery[index] = value;
      return { ...prev, gallery: newGallery };
    });
  };

  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      "title",
      "sku",
      "description",
      "brand",
      "quantity",
      "originalPrice",
      "playerLevel",
      "playType",
      "playingStyle",
      "shaftFlexibility",
      "balancePoint",
      "weight",
      "length",
      "thumbnailUrl",
    ];

    requiredFields.forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

  
    if (formData.salePrice) {
      const errorMsg = validateField("salePrice", formData.salePrice);
      if (errorMsg) {
        newErrors.salePrice = errorMsg;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const allTouched = {
      title: true,
      sku: true,
      description: true,
      brand: true,
      quantity: true,
      originalPrice: true,
      salePrice: true,
      playerLevel: true,
      playType: true,
      playingStyle: true,
      shaftFlexibility: true,
      balancePoint: true,
      weight: true,
      length: true,
      thumbnailUrl: true,
    };
    setTouched(allTouched);

    // Validate tất cả
    if (!validateAllFields()) {
      alert(
        "Vui lòng điền đầy đủ thông tin và kiểm tra lại các trường bị lỗi!"
      );
      return;
    }

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
      <Modal show={showModal} onHide={handleClose} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* THÔNG TIN CƠ BẢN */}
            <h5 className="mb-3 text-primary">Thông tin cơ bản</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Tên sản phẩm <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    placeholder="VD: Vợt Cầu Lông Yonex Astrox 100ZZ"
                    isInvalid={touched.title && !!errors.title}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    SKU (Mã sản phẩm) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("sku")}
                    placeholder="VD: YX-AX100ZZ-KR"
                    isInvalid={touched.sku && !!errors.sku}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sku}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Mô tả sản phẩm <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                placeholder="Mô tả chi tiết về sản phẩm..."
                isInvalid={touched.description && !!errors.description}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Thương hiệu <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="brand"
                    value={formData.brand || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("brand")}
                    isInvalid={touched.brand && !!errors.brand}
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
                    {errors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Số lượng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    onBlur={() => handleBlur("quantity")}
                    placeholder="Nhập số lượng sản phẩm"
                    isInvalid={touched.quantity && !!errors.quantity}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* GIÁ CẢ */}
            <h5 className="mb-3 text-primary mt-4">Giá cả</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Giá gốc (₫) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    onBlur={() => handleBlur("originalPrice")}
                    placeholder="Nhập giá gốc"
                    step="1000"
                    isInvalid={touched.originalPrice && !!errors.originalPrice}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.originalPrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá khuyến mãi (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    onBlur={() => handleBlur("salePrice")}
                    placeholder="Nhập giá khuyến mãi (nếu có)"
                    step="1000"
                    isInvalid={touched.salePrice && !!errors.salePrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salePrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* THÔNG SỐ KỸ THUẬT */}
            <h5 className="mb-3 text-primary mt-4">Thông số kỹ thuật</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Trình độ người chơi <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playerLevel"
                    value={formData.playerLevel || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("playerLevel")}
                    isInvalid={touched.playerLevel && !!errors.playerLevel}
                    required
                  >
                    <option value="">-- Chọn trình độ --</option>
                    <option value="Người mới bắt đầu">Người mới bắt đầu</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.playerLevel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Kiểu đánh <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playType"
                    value={formData.playType || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("playType")}
                    isInvalid={touched.playType && !!errors.playType}
                    required
                  >
                    <option value="">-- Chọn kiểu đánh --</option>
                    <option value="Đánh đơn">Đánh đơn</option>
                    <option value="Đánh đôi">Đánh đôi</option>
                    <option value="Đánh đơn và đôi">Đánh đơn và đôi</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.playType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Phong cách chơi <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="playingStyle"
                    value={formData.playingStyle || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("playingStyle")}
                    isInvalid={touched.playingStyle && !!errors.playingStyle}
                    required
                  >
                    <option value="">-- Chọn phong cách --</option>
                    <option value="Tấn công">Tấn công</option>
                    <option value="Phòng thủ">Phòng thủ</option>
                    <option value="Toàn diện">Toàn diện</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.playingStyle}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Độ dẻo thân vợt <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="shaftFlexibility"
                    value={formData.shaftFlexibility || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("shaftFlexibility")}
                    isInvalid={
                      touched.shaftFlexibility && !!errors.shaftFlexibility
                    }
                    required
                  >
                    <option value="">-- Chọn độ dẻo --</option>
                    <option value="Dẻo">Dẻo</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Cứng">Cứng</option>
                    <option value="Siêu cứng">Siêu cứng</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.shaftFlexibility}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Điểm cân bằng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="balancePoint"
                    value={formData.balancePoint || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("balancePoint")}
                    isInvalid={touched.balancePoint && !!errors.balancePoint}
                    required
                  >
                    <option value="">-- Chọn điểm cân bằng --</option>
                    <option value="Nhẹ đầu">Nhẹ đầu</option>
                    <option value="Cân bằng">Cân bằng</option>
                    <option value="Nặng đầu">Nặng đầu</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.balancePoint}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Trọng lượng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("weight")}
                    isInvalid={touched.weight && !!errors.weight}
                    required
                  >
                    <option value="">-- Chọn trọng lượng --</option>
                    <option value="3U">3U (85-89g)</option>
                    <option value="4U">4U (80-84g)</option>
                    <option value="5U">5U (75-79g)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Chiều dài <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="length"
                    value={formData.length || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("length")}
                    placeholder="VD: 675mm"
                    isInvalid={touched.length && !!errors.length}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.length}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* HÌNH ẢNH */}
            <h5 className="mb-3 text-primary mt-4">Hình ảnh sản phẩm</h5>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Ảnh đại diện (Thumbnail) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("thumbnailUrl")}
                placeholder="/images/products/your-image.webp"
                isInvalid={touched.thumbnailUrl && !!errors.thumbnailUrl}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.thumbnailUrl}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <PlusCircle className="me-2" />
            {currentProduct ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductManager;
