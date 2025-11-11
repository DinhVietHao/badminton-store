import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { PencilSquare, Trash, PlusCircle, Eye } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  addProduct,
  updateProduct,
  removeProduct,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../redux/slices/productSlice";
import { useFetchProducts } from "../../hooks/useFetchProducts";

const fmt = (value) =>
  typeof value === "number" && !Number.isNaN(value)
    ? value.toLocaleString("vi-VN") + " ₫"
    : "0 ₫";

const STATUS_MAP = {
  "IN-STOCK": "Còn hàng",
  "OUT-OF-STOCK": "Hết hàng",
};

const ProductManager = () => {
  const dispatch = useDispatch();
  useFetchProducts();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const PRODUCTS_PER_PAGE = 10;

  const handleAdd = () => {
    setCurrentProduct(null);
    setFormData({
      title: "",
      brand: "",
      originalPrice: 0,
      salePrice: 0,
      thumbnailUrl: "",
      status: "IN-STOCK",
      quantity: 0,
      soldCount: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setActionLoading(true);
    try {
      if (currentProduct) {
        const response = await axios.put(
          `http://localhost:5000/products/${currentProduct.id}`,
          formData
        );

        dispatch(updateProduct(response.data));
        alert("Cập nhật sản phẩm thành công!");
      } else {
        const nextId =
          products.length > 0
            ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1
            : 1;

        const newProduct = {
          ...formData,
          id: String(nextId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const response = await axios.post(
          "http://localhost:5000/products",
          newProduct
        );

        dispatch(addProduct(response.data));
        alert("Thêm sản phẩm thành công!");
      }

      handleClose();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lưu sản phẩm!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setActionLoading(true);

      try {
        await axios.delete(`http://localhost:5000/products/${id}`);

        dispatch(removeProduct(id));
        alert("Đã xóa sản phẩm thành công!");
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi xóa sản phẩm!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Lỗi: {error}</Alert>;
  }

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
        <Button variant="primary" onClick={handleAdd} disabled={actionLoading}>
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
                  disabled={actionLoading}
                >
                  <PencilSquare />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={actionLoading}
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

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Thương hiệu</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Giá gốc</Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || 0}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Giá sale</Form.Label>
                  <Form.Control
                    type="number"
                    name="salePrice"
                    value={formData.salePrice || 0}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity || 0}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Đã bán</Form.Label>
                  <Form.Control
                    type="number"
                    name="soldCount"
                    value={formData.soldCount || 0}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>URL Ảnh đại diện</Form.Label>
              <Form.Control
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status || "IN-STOCK"}
                onChange={handleChange}
              >
                <option value="IN-STOCK">IN-STOCK (Còn hàng)</option>
                <option value="OUT-OF-STOCK">OUT-OF-STOCK (Hết hàng)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductManager;